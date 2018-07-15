
declare var require: any
//declare var process: any
declare var console: any
declare var __dirname: any

const express = require('express')
const basicAuth = require('express-basic-auth')
const cors = require('cors')
const yaml = require('js-yaml')
const fs = require('fs')

import {  RetMsg, MetaPro, Watch, AdminSrv, MDevSrv, Scrape} from 'nbake/lib/Base'

const logger = require('tracer').console()

// ///////////////////////////////////////////
let config = yaml.load(fs.readFileSync(__dirname +'/admin.yaml'))
console.log(config)

const server = express()
server.use(cors())
server.use(basicAuth({
   users: { 'admin': config.secret }
}))

// routes ///////////////////////////////////////
const ms = new MetaPro(config)
server.get('/api/last', function (req, res) {
   console.log(' last')
   res.setHeader('Content-Type', 'application/json')

   let ret:RetMsg = ms.getLastMsg()
   if(ret.code<0)
      res.status(500).send(ret.msg)
   else
      res.json(ret.msg)
})
server.get('/api/bake', function (req, res) {
   console.log(' bake')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro.folderProp]

   let ret:RetMsg = ms.bake(dir)
   if(ret.code<0)
      res.status(500).send(ret.msg)
   else
      res.json(ret.msg)
})
server.get('/api/tag', function (req, res) {
   console.log(' tag')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaPro.folderProp]

   let ret:RetMsg = ms.tag(dir)
   if(ret.code<0)
      res.status(500).send(ret.msg)
   else
      res.json(ret.msg)
})
server.get('/api/itemize', function (req, res) {
   console.log(' itemize')
   res.setHeader('Content-Type', 'application/json')

   let ret:RetMsg = ms.itemize()
   if(ret.code<0)
      res.status(500).send(ret.msg)
   else
      res.json(ret.msg)
})

// ///////////////////////////////////////
var listener = server.listen(config.services_port, function () {
   var host = listener.address().address
   var port = listener.address().port
   console.log("admin services port at http://%s:%s", host, port)
   //console.log(server._router.stack )
})

let app = new MDevSrv(config)
let admin = new AdminSrv(config)
let w = new Watch(ms, config)

// do the first build
setTimeout(function(){
   console.log('Startup build:')
   ms.tagRoot()
   startW()
}, 6000)

function startW() {
   setTimeout(function(){
      w.start()
   }, 8000)
}

// //////////////////////////////////////////////////////////
let sc =new Scrape()
sc.s('https://www.usatoday.com/story/opinion/nation-now/2018/05/19/university-michigans-speech-policies-those-soviet-russia/620724002/')
   .then(function(resp){
      console.log(resp)
   })
