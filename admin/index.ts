
declare var require: any
declare var process: any
declare var console: any
declare var __dirname: any


const express = require('express')
const basicAuth = require('express-basic-auth')
const cors = require('cors')
const yaml = require('js-yaml')
const fs = require('fs')
const chokidar = require('chokidar')
const reload = require('reload')


import { Dirs, Bake, Items, Tag, Meta, RetMsg } from 'nBake/lib/Base'

const logger = require('tracer').console()

// ///////////////////////////////////////
let config = yaml.load(fs.readFileSync(__dirname +'/admin.yaml'))
console.log(config)

const server = express()
server.use(cors())
server.use(basicAuth({
   users: { 'admin': config.secret }
}))


// class ///////////////////////////////////////
export class MDevSrv {
   static reloadServer
   // http://github.com/alallier/reload

   constructor(config) {
      let dir = config['mount']
      let port = config['mount_port']

      let app = express()
      logger.trace(dir,port)
      app.set('app port', port)

      MDevSrv.reloadServer = reload(app)

      app.set('views', dir)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.trace('dev app'+port)
      })
   }//()
}//class
export class AdminSrv { // until we write a push service
   static reloadServer
   // http://github.com/alallier/reload

   constructor(config) {
      let dir = config['admin']
      let port = config['admin_port']

      let app = express()
      logger.trace(dir,port)
      app.set('admin port', port)

      AdminSrv.reloadServer = reload(app)

      app.set('views', dir)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.trace('admin app'+port)
      })
   }//()
}//class


export class Watch {
   root
   watcher

   mp: MetaPro
   constructor(mp_:MetaPro) {
      this.mp = mp_
   }

   start() {
      console.log('watch only works on linux on ssh watched drives - that are likely S3 mounts')
      this.watcher = chokidar.watch(this.root, {
         ignored: '*.html',
         ignoreInitial: true,
         cwd: this.root,
         usePolling: true,
         binaryInterval: 100000,
         interval: 320,
         alwaysStat: true
      })

      let thiz = this
      this.watcher.on('add', function( path ){
         thiz.auto(path)
         thiz.auto(path)
      })
      this.watcher.on('change', function(path ){
         thiz.auto(path)
      })

      this.refreshBro()
   }//()

   refreshBro() {
      setTimeout(function () {
         MDevSrv.reloadServer.reload({verbose:true})
         AdminSrv.reloadServer.reload()
      }, 320)
   }

   auto(path:string) {//process
      let p = path.lastIndexOf('/')
      let folder = ''
      let fn = path

      if(p>0) {
         folder = path.substring(0,p)
         fn = path.substr(p+1)
      }
      console.log(folder, fn)

      try {
         const fn = path
         this.mp.autoBake(folder, fn)
         this.refreshBro()

      } catch(err) {
         logger.warn(err)
      }
   }
}//class

export class MetaPro {
   mount:string
   m = new Meta()
   static folderProp = 'folder'

   static srcProp = 'src'
   static destProp = 'dest'

   _lastMsg:RetMsg

   setLast(m:RetMsg) {
      this._lastMsg = new RetMsg(m._cmd, m.code, m.msg)
   }
   getLastMsg():RetMsg{
      let m = this._lastMsg
      return new RetMsg(m._cmd, m.code, m.msg)
   }

   constructor(config) {
      this.mount = config.mount
   }

   all() {
      let msg:RetMsg = this.m.all(this.mount)
      this.setLast(msg)
      return msg
   }

   bake(dir:string):RetMsg {
      let folder = this.mount + dir
      logger.trace(folder)
      let msg:RetMsg = this.m.bake(folder)
      this.setLast(msg)
      return msg
   }
   tag(dir:string):RetMsg {
      let folder = this.mount + dir
      logger.trace(folder)
      let msg:RetMsg = this.m.tag(folder)
      this.setLast(msg)
      return msg
   }
   itemize():RetMsg {
      let msg:RetMsg = this.m.itemize(this.mount)
      this.setLast(msg)
      return msg
   }

   // when you pass the file name, ex: watch
   autoBake(folder, file):RetMsg {
      const full = this.mount+folder +'/'+ file
      logger.trace(full)
      const ext = file.split('.').pop()

      if (ext =='md')
         return this.bake(folder)

      if (ext =='pug') {
         if( file.indexOf('-tag') >= 0 )
            return this.tag(folder)
         else
            return this.bake(folder)
      }

      if (ext =='yaml') // bake and itemize
         return this.m.itemizeNBake(folder)

      let m =  new RetMsg(folder+'-'+file,-1,'nothing to bake')
      this.setLast(m)// maybe not set it to avoid noise?
      return m
   }
}
const ms = new MetaPro(config)

// routes ///////////////////////////////////////
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

