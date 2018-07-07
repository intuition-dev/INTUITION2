
declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

const server = require('express')()
const basicAuth = require('express-basic-auth')
const cors = require('cors')
const yaml = require('js-yaml')
const fs = require('fs')

import { Dirs, Bake, Items, Tag, Meta, RetMsg } from 'nBake/lib/Base'

const logger = require('tracer').console()

// ///////////////////////////////////////
let config = yaml.load(fs.readFileSync(__dirname +'/admin.yaml'))
console.log(config)

server.use(cors())
server.use(basicAuth({
   users: { 'admin': config.secret }
}))


// class ///////////////////////////////////////
export class MetaSrv {
   mount:string
   m = new Meta()
   static folderProp = 'folder'

	static srcProp = 'src'
   static destProp = 'dest'

   constructor(config) {
      this.mount = config.mount
   }

   bake(dir:string):RetMsg {
      let folder = this.mount + dir
      logger.trace(folder)
      let msg:RetMsg = this.m.bake(folder)
      return msg
   }
   tag(dir:string):RetMsg {
      let folder = this.mount + dir
      logger.trace(folder)
      let msg:RetMsg = this.m.tag(folder)
      return msg
   }
   itemize(dir:string):RetMsg {
      let folder = this.mount + dir
      logger.trace(folder)
      let msg:RetMsg = this.m.itemize(folder)
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

		return new RetMsg(-1,'nothing to bake')
	}
}
const ms = new MetaSrv(config)

// routes ///////////////////////////////////////

server.get('/api/bake', function (req, res) {
   console.log(' bake')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaSrv.folderProp]

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
   let dir = qs[MetaSrv.folderProp]

   let ret:RetMsg = ms.tag(dir)
   if(ret.code<0)
      res.status(500).send(ret.msg)
   else
      res.json(ret.msg)
})
server.get('/api/itemize', function (req, res) {
   console.log(' itemize')
   res.setHeader('Content-Type', 'application/json')
   let qs = req.query
   let dir = qs[MetaSrv.folderProp]

   let ret:RetMsg = ms.itemize(dir)
   if(ret.code<0)
      res.status(500).send(ret.msg)
   else
      res.json(ret.msg)
})

// ///////////////////////////////////////
var listener = server.listen(config.mount_port, function () {
   var host = listener.address().address
   var port = listener.address().port
   console.log("Server listening at http://%s:%s", host, port)
   console.log(server._router.stack )
})

