
declare var require: any
//declare var process: any
declare var console: any
declare var Buffer: any

declare var __dirname: any

const express = require('express')
const basicAuth = require('express-basic-auth')
const cors = require('cors')
const yaml = require('js-yaml')
const fs = require('fs')
const bodyParser = require('body-parser')


import { RetMsg, MetaPro, Watch, AdminSrv, MDevSrv, Scrape, FileOps, Dat, Ver } from 'mbake/lib/Base'

const logger = require('tracer').console()
console.log(new Ver().ver())
// ///////////////////////////////////////////
let config = yaml.load(fs.readFileSync(__dirname +'/admin.yaml'))
console.log(config)

const server = express()
server.use(cors())
server.use(basicAuth({
   users: { 'admin': config.secret }
}))

// routes ///////////////////////////////////////
server.use(bodyParser())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

const mp = new MetaPro(config)
const sc = new Scrape()
const fo = new FileOps(config.mount)

server.get('/api/last', function (req, res) {
   console.log(' last')
   res.setHeader('Content-Type', 'application/json')

   let ret:RetMsg = mp.getLastMsg()
   if(ret.code<0)
      res.status(500).send(ret)
   else
      res.json(ret)
})//api
server.get('/api/bake', function (req, res) {
   console.log(' bake')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro.folderProp]

   let ret:RetMsg = mp.bake(dir)
   if(ret.code<0)
      res.status(500).send(ret)
   else
      res.json(ret)
})//api
server.get('/api/tag', function (req, res) {
   console.log(' tag')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro.folderProp]

   let ret:RetMsg = mp.tag(dir)
   if(ret.code<0)
      res.status(500).send(ret)
   else
      res.json(ret)
})//api
server.get('/api/itemize', function (req, res) {
   console.log(' itemize')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro.folderProp]

   let ret:RetMsg = mp.itemize(dir)
   if(ret.code<0)
      res.status(500).send(ret)
   else
      res.json(ret)
})//api
server.get('/api/scrape', function (req, res) {
   console.log(' scrape')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let url = qs['url']
   let b = new Buffer(url, 'base64')
   url = b.toString()

   sc.s(url)
      .then(function(resp){
      // respond
      console.log(resp)
      let ret:RetMsg = new RetMsg('sc',1, resp)
      res.json(ret)
   })
})//api

server.post('/api/newLinkBlog', function (req, res) {
   console.log(' newLinkBlog')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let url = qs['url']
   let b = new Buffer(url, 'base64')
   url = b.toString()

   let src = qs['src']
   let dest = qs['dest']
   let comment = req.body.comment

   try {
      sc.s(url)
         .then(function(resp){
            logger.trace(resp)
            fo.clone(src,dest)
            const p = config.mount + dest
            logger.trace(p)

            const d = new Dat(p)
            let imgUrl = resp['image']
            d.set('title', resp['title'])
            d.set('image', imgUrl)
            d.set('content_text', resp['content_text'])
            d.set('comment', resp['comment'])
            d.set('external_url', url)
            d.set('date_published', (new Date()).toISOString() )
            d.write()

            sc.getImageSize(imgUrl, function(err,idata) {
               // respond
               let ret:RetMsg = new RetMsg('sc',1, resp)
               res.json(ret)

               if(err) {
                     logger.trace(err)
                     return
                  }
                  logger.trace(JSON.stringify(idata))
                  d.set('img_w',idata['width'])
                  d.set('img_h',idata['height'])
                  d.set('img_typ',idata['type'])
                  d.set('img_sz',idata['length'])
                  d.write()
               })

            // write md
            let md = dest+'/comment.md'
            logger.trace(md)
            fo.write(comment, md)

         })
   } catch(err) {
      console.log('// ERR //////////////////////////////////////////////////////')
      console.log(err)
   }
})//api

server.get('/api/clone', function (req, res) {
   console.log(' itemize')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let src = qs['src']
   let dest = qs['dest']

   let ret:RetMsg = fo.clone(src, dest)
   if(ret.code<0)
      res.status(500).send(ret)
   else
      res.json(ret)
})//api

// /////////////////////////////////////////////////////////////////
var listener = server.listen(config.services_port, function () {
   var host = listener.address().address
   var port = listener.address().port
   console.log("admin services port at http://%s:%s", host, port)
   //console.log(server._router.stack )
})

let app = new MDevSrv(config)
let admin = new AdminSrv(config)
let w = new Watch(mp, config)

// do the first build
setTimeout(function(){
   console.log('Startup build:')
   mp.tagRoot()
   startW()
}, 3000)

function startW() {
   if(!config.admin_watch) return // if you mount more than one admin: only one should 'file watch'

   setTimeout(function(){
      w.start()
      console.log('// READY //////////////////////////////////////////////////////')
   }, 3000)
}
