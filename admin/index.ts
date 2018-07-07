
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
let config = yaml.load(fs.readFileSync('admin.yaml'))
config['mount'] ='/Users/uptim/Documents/GitHub/B-M-SPA/blog'
console.log(config)




server.use(cors())
server.use(basicAuth({
   users: { 'admin': '123' }
}))


// ///////////////////////////////////////
export class BakeSrv {
   mount:string
   m = new Meta()
   constructor(config) {
      this.mount = config.mount
   }

   bake(dir:string) {
      let folder = this.mount + dir

      logger.trace(folder)
      this.m.bake(folder)

   }
}

const bs = new BakeSrv(config)
bs.bake('/')

// ///////////////////////////////////////

server.get('/listUsers', function (req, res) {
   res.setHeader('Content-Type', 'application/json')
   res.json({ a: 1 })
   //res.status(500).send('Something broke!')
})

server.get('/api/bake', function (req, res) {
   res.setHeader('Content-Type', 'application/json')
   res.json({ a: 1 })
   //res.status(500).send('Something broke!')
})

// ///////////////////////////////////////
var listener = server.listen(9090, function () {
   var host = listener.address().address
   var port = listener.address().port
   console.log("Server listening at http://%s:%s", host, port)
})

