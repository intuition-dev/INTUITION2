
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
const slugify = require('slugify')


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
server.get('/api/items', function (req, res) {
   console.log(' items')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro.folderProp]

   let ret:RetMsg = mp.getItems(dir)
   if(ret.code<0)
      res.status(500).send(ret.cmd)
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
   let tags = req.body.tags

   try {
      sc.s(url)
         .then(function(resp){
            logger.trace(resp)
            fo.clone(src,dest) //w1, few files, ~ 1 second watch
            const p = config.mount + dest
            logger.trace(p)

            let d = new Dat(p)
            let imgUrl = resp['image']
            d.set('tags', tags)
            d.set('title', resp['title'])
            d.set('image', imgUrl)
            d.set('content_text', comment)
            d.set('comment', resp['content_text'])
            d.set('external_url', url)
            d.set('date_published', (new Date()).toISOString() )
            d.set('publish', true ) // or leave as default: false
            d.write() //w2

            Scrape.getImageSize('https://i.imgur.com/YdwRA30.jpg').then(function(idata){
               d.set('img_w',idata['width'])
               d.set('img_h',idata['height'])
               d.set('img_typ',idata['type'])
               d.set('img_sz',idata['length'])
               d.write() //w3
            })

            // respond
            let ret:RetMsg = new RetMsg('sc',1, resp)
            res.json(ret)

            logger.trace(comment)
            // write md
            let md = dest+'/comment.md'
            logger.trace(md)
            fo.write(md, comment) //w4
            console.log('II scrape done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')

         })
   } catch(err) {
      console.log('// ERR //////////////////////////////////////////////////////')
      console.log(err)
   }
})//api

server.post('/api/newBlog', function (req, res) {
   console.log(' newBlog')
   res.setHeader('Content-Type', 'application/json')
   let body = req.body
   
   let folder = body.folder   
   let title = body.title
   let comment = body.summary
   let content = body.content
   let img_url = body.img_url

   //create folder name from title
   //prefix with yyy__mm__dd of publish date for sort order?
   let dest = '/' + folder + '/'+slugify(title.toLowerCase())
   logger.trace('sanitized folder:'+dest)
   
   try {
     
     const p = config.mount + dest
     logger.trace(p)
     
     let i = 1, p0 = p;
     while (fs.existsSync(p0)) { //avoid duplicate foldernames by adding 2, 3
       i++ 
       p0 = p + i
     }
     if (i>1) dest = dest + i

     fo.clone('/blog/template', dest)

     let d = new Dat(p0)
     let imgUrl = 
     d.set('title', title)
     d.set('comment', comment)
     d.set('tags', body.tags)
     d.set('image', img_url)     
     d.set('external_url', 'NA')
     d.set('date_published', body.date_published )
     d.set('publish', true ) //if false 