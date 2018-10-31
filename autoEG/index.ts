// All rights Metabake.org | Wolfgang Gehner, licensed under MIT

declare var require: any
//declare var process: any
declare var console: any
declare var Buffer: any

declare var __dirname: any

const express = require('express')
const basicAuth = require('express-basic-auth')

//when using firebase auth
const fbAuth = require('express-firebase-auth')
const fbAdmin = require('firebase-admin')

const cors = require('cors')
const yaml = require('js-yaml')
const fs = require('fs')
const bodyParser = require('body-parser')
const slugify = require('slugify')
const nocache = require('nocache');

import { RetMsg, MetaPro2, Watch2, AdminSrv, MDevSrv2, Scrape, FileOps, Dat, Ver } from 'mbake/lib/Base'

const logger = require('tracer').console()
console.log(new Ver().ver())
// ///////////////////////////////////////////
let config = yaml.load(fs.readFileSync(__dirname +'/admin.yaml'))
console.log(config)

const server = express()
server.use(cors())

import { createFirebaseAuth } from 'express-firebase-auth';

let admin = new AdminSrv(config)

if (config.auth=='firebase'){ //firebase
   /*var fbApp = fbAdmin.initializeApp({
      credential: fbAdmin.credential.cert(fbServiceAccount)
      //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
   });*/
   //var fbServiceAccount = require('express-firebase-auth/firebase-config.json')
   let fbServiceAccount = new Object(JSON.parse(fs.readFileSync(config.firebase_config)))
   const firebaseAuth = createFirebaseAuth({
      /*serviceAccount: fbServiceAccount,*/
      firebase: admin.fbApp, 
      ignoredUrls: [
         '/ignore'
      ]
   })
   server.use(firebaseAuth);
}
else //basic
{
   if (config.basic_users)
      server.use(basicAuth({users: config.basic_users}))
   else
      server.use(basicAuth({users: {'admin': config.secret}})) //legacy
}


// routes ///////////////////////////////////////
server.use(bodyParser({limit: '10mb', extended: true }))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(nocache())
 

const mp = new MetaPro2(config.mount)
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
   let dir = qs[MetaPro2.folderProp]

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
   let dir = qs[MetaPro2.folderProp]

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
   let dir = qs[MetaPro2.folderProp]

   let ret:RetMsg = mp.getItems(dir)
   if(ret.code<0)
      res.status(500).send(ret.cmd)
   else
      res.json(ret)
})//api
server.get('/api/item', function (req, res) {
   console.log(' item')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let path = qs['path']
         if (path.indexOf('?')==0) path = path.substring(1)
   if (path.indexOf('/')==0) path = path.substring(1)
   let parts = path.split('/')
      if (parts.length==0) {
      console.log('invalid path')
      return //TODO proper MSG
   }
   let item = parts[parts.length-1]
   parts.pop()
   let listfolder = parts.join('/')
   console.log('listfolder'+listfolder)

   let ret:RetMsg = mp.getItem(listfolder, item)
   if(ret.code<0)
      res.status(500).send(ret.cmd)
   else
      res.json(ret)
})//api
server.get('/api/users', function (req, res) {
      console.log(' users')
      res.setHeader('Content-Type', 'application/json')
      let qs = req.query
      let folder = qs['folder']
      mp.getUsers(req, res, folder) //async
   })//api


server.get('/api/itemize', function (req, res) {
   console.log(' itemize')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro2.folderProp]
  
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

server.post('/api/item', function (req, res) {
   console.log(' add or update item')
   res.setHeader('Content-Type', 'application/json')
   let body = req.body
   let action = body.action
   let folder = body.folder   
   let title = body.title
   let comment = body.summary
   let content = body.content
   let f1 = body.f1
   let fx = body.fx
   let f1name = body.f1name
   logger.trace('f1name'+f1name)

   let isNew = ('insert'===action)
   logger.trace("isNew"+isNew)

   let dest = '/' + folder
   if (isNew) //create folder name from title
      dest = '/' + folder + '/'+slugify(title.toLowerCase())

   const p = config.mount + dest
   logger.trace(p)
 
   try {
     let p0 = p;
     if (isNew) {
         let i = 1 
         while (fs.existsSync(p0)) { //avoid duplicate foldernames by adding 2, 3
            i++ 
            p0 = p + i
         }
         if (i>1) dest = dest + i

         fo.clone('/blog/template', dest) //insert template
     }

     let d = new Dat(p0)
     d.set('title', title)
     d.set('comment', comment)
     d.set('tags', body.tags)
     d.set('external_url', 'NA')
     d.set('date_published', body.date_published )
     d.set('publish', true ) //if false it's not included in items.json
     d.write() //add or update items in dat.yaml

     //in case of update, we want to clean out removed images. So we build a list of pre-update
     //images so we can do the diff.
     let oldmedia = [], newmedia = []
     if (!isNew) {
        oldmedia = fo.getMediaFilenames(folder)
        console.log('oldmedia'+oldmedia)
     }

     //handle Featured Image
      if (f1name)
      {
            newmedia.push(f1name)
            if (f1 && f1.indexOf('data:')==0) //newly uploaded image
            {
               var buffer = Buffer.from(f1.split(",")[1], 'base64')
               let f1path = dest + '/' + f1name
               fo.write(f1path, buffer)
               d.set('image', f1name) 
               d.write()
            }
            //else its existing media, do nothing
      }
      else //image was removed
      {
         d.set('image', '')
         d.write()
      }

      //handle Media items
      if (fx && fx != '[]')
      {
         let mediaitems = JSON.parse(fx)
         let j, len = mediaitems.length
         for (j = 0; j < len; j++)
         {
            let obj = mediaitems[j]
            let f1path = dest + '/' + obj.filename
            newmedia.push(obj.filename)
            if (obj.src.indexOf('data:')==0) //newly uploaded image
            {
               var buffer = Buffer.from(obj.src.split(",")[1], 'base64')
               fo.write(f1path, buffer)
            }
            //else its existing media, do nothing
         }
      }
      console.log('Writing media done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')

      if (!isNew) {  //remove images that are in old but not in new
         let k = 0, klen = oldmedia.length
         for (k; k < klen; k++)
         {
            if (newmedia.indexOf(oldmedia[k])==-1)
            {
               fo.removeFile(dest+'/'+oldmedia[k])
            }
         }
      }

      // write content
      let md = dest+'/content.md'
      logger.trace(md)
      fo.write(md, content) //w4
      console.log('Writing content done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')

     let rex:RetMsg = mp.bake(dest)
      console.log('Baking done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
     
     let ret:RetMsg = mp.itemizeOnly(folder) //return array of items
     if(ret.code<0)
        res.status(500).send(ret)
     else
        res.json(ret)
      console.log('Itemize done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
       
   } catch(err) {
      console.log('// ERR //////////////////////////////////////////////////////')
      console.log(err)
   }
})//api

server.get('/api/removeitem', function (req, res) {
   console.log(' removeitem')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let listfolder = qs['listfolder']
   let item = qs['item']

   fo.remove('/'+listfolder+'/'+item)
   mp.itemizeOnly(listfolder)

   let ret:RetMsg = mp.getItems(listfolder)
   if(ret.code<0)
      res.status(500).send(ret.cmd)
   else
      res.json(ret)
})//api

server.post('/api/user', function (req, res) {
   console.log(' add or update user')
   res.setHeader('Content-Type', 'application/json')
   let body = req.body
   let action = body.action
   let folder = body.folder //for the item
   let currentRole = body.role
   let f1 = body.f1
   let f1name = body.f1name
   logger.trace('f1name'+f1name)

   let isNew = ('insert'===action)
   logger.trace("isNew"+isNew)

   let dest = '/team/' + folder

   const p = config.mount + dest
   logger.trace('creating item at'+p)
   
   try {
      
      if (isNew)
      fo.clone('/team/template', dest) //insert template

      let d = new Dat(p)
      d.set('currentRole', currentRole)
      //d.set('date_created', body.date_created )
      d.set('publish', true ) //if false it's not included in items.json
      d.write() //add or update items in dat.yaml

      //in case of update, we want to clean out removed images. So we build a list of pre-update
      //images so we can do the diff.
      let oldmedia = [], newmedia = []
      if (!isNew) {
         oldmedia = fo.getMediaFilenames(folder)
         console.log('oldmedia'+oldmedia)
      }

      //handle Featured Image
      if (f1name)
      {
            newmedia.push(f1name)
            if (f1 && f1.indexOf('data:')==0) //newly uploaded image
            {
               var buffer = Buffer.from(f1.split(",")[1], 'base64')
               let f1path = dest + '/' + f1name
               fo.write(f1path, buffer)
               d.set('image', f1name) 
               d.write()
            }
            //else its existing media, do nothing
      }
      else //image was removed
      {
         d.set('image', '')
         d.write()
      }

      if (!isNew) {  //remove images that are in old but not in new
         let k = 0, klen = oldmedia.length
         for (k; k < klen; k++)
         {
            if (newmedia.indexOf(oldmedia[k])==-1)
            {
               fo.removeFile(dest+'/'+oldmedia[k])
            }
         }
      }

      /* write content
      let md = dest+'/content.md'
      //logger.trace(md)
      //fo.write(md, content) //w4
      console.log('Writing content done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')

      let rex:RetMsg = mp.bake(dest)
      console.log('Baking done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII') */
      
      let ret:RetMsg = mp.itemizeOnly('team') //key by URL
      if(ret.code<0)
         res.status(500).send(ret)
      else
         res.json(ret)
      console.log('Itemize done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')

   } catch(err) {
      console.log('// ERR //////////////////////////////////////////////////////')
      console.log(err)
   }
})//api

server.get('/api/removeuser', function (req, res) {
   console.log(' removeitem')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let listfolder = qs['listfolder']
   let item = qs['item']
   fo.remove('/'+listfolder+'/'+item)
   mp.itemizeOnly(listfolder)
   mp.deleteAuthUser(item)
  .then(function() {
      mp.getUsers(req, res, listfolder)
  })
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

let app = new MDevSrv2(config['mount'], config['mount_port'], true) //= ignore reload
// let admin = new AdminSrv(config) //moved



let w = new Watch2(mp, config['mount'])

// do the first build
setTimeout(function(){
   console.log('Startup build:')
   mp.tagRoot()
   startW()
}, 4000)

function startW() {
   if(!config.admin_watch) return // if you mount more than one admin: only one should 'file watch'

   setTimeout(function(){
      w.start(true) // true for WAN, eg: mounted drive
      console.log('// READY //////////////////////////////////////////////////////')
   }, 3000)
}
