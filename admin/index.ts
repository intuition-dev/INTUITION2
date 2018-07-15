
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
const mp = new MetaPro(config)
const sc = new Scrape()
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

   sc.s(url)
      .then(function(resp){
      // respond
      console.log(resp)
      let ret:RetMsg = new RetMsg('sc',1, resp)
      res.json(ret)
   })
})//api

// ///////////////////////////////////////
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
}, 6000)

function startW() {
   setTimeout(function(){
      w.start()
   }, 8000)
}

// exp /////////////////////////////////////////////////////////
/*
sc.s('https://www.usatoday.com/story/opinion/nation-now/2018/05/19/university-michigans-speech-policies-those-soviet-russia/620724002/')
   .then(function(resp){
      console.log(resp)
   })
*/
