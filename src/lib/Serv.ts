// All rights reserved by MetaBake (MetaBake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('express-formidable')

const logger = require('tracer').console()

export class CustomCors {

   constructor(validOrigins:Array<string>) {

      return (request, response, next) => {
   
         const origin = request.get('origin')
         if (!origin) {
            return next()
         }

         let approved = false
         validOrigins.forEach( function(ori) { 
            if(ori=='*')  approved = true
            if(origin.includes(ori)) approved = true // allow on string match
         })
         logger.trace(origin, approved)
         if(approved) {
            response.setHeader('Access-Control-Allow-Origin', origin)
            return next()
         } 
         
         //else
         response.status(403).end()
      }
   }//()
   
   static getReqAsOrigin(req):string {// no used
      let proto = req.connection.encrypted ? 'https' : 'http'
      const host = req.hostname
      let original = req.originalUrl
      logger.trace(original)

      let origin = proto + '://' + host
      return origin
   }
}//class

/**
 * Don't use methods here for GET or Upload, use the appInst to do it 'manually'
 */
export class ExpressRPC {
   
   /**
    * DON'T access outside
    */
   static _appInst // forces single port in case of static content

   /**
    This is how to a access it
    */
   get appInst() { return ExpressRPC._appInst }

   /**
    * @param origins An array of string that would match a domain. So host would match localhost. eg ['*'] 
    */
   makeInstance(origins:Array<string>) {
      // does it already exist?
      if(ExpressRPC._appInst) throw new Error( 'one instance of express app already exists')
      console.log('Allowed >>> ', origins)
      const cors = new CustomCors(origins)
      ExpressRPC._appInst = express()
      this.appInst.use(cors)

      this.appInst.use(bodyParser.urlencoded({ extended: false }))
      this.appInst.use(formidable())// for fetch
   }

   /**
    * It is a post, so won't be edge cached
    * @param route RPC route
    * @param foo function
   Example foo(req, res)
   {
      const method = req.fields.method
      const params = JSON.parse( req.fields.params )
      if('save'==method) { 
         // possibly send to business layer away from protocol layer, that layer talks to DB and other services 
      }
      // etc...
      const resp:any= {} // new response
      resp.result = foo(params)
      res.json(resp)
   } else {
      resp.errorLevel = -1
      resp.errorMessage = 'mismatch'
      console.log(resp)
      res.json(resp)
   }
    */
   handleRRoute(route:string, pgOrScreen:string, foo:Function) {
      const r: string = '/'+route  + '/'+pgOrScreen
      this.appInst.post(r, foo)
   }

   /**
    * It is a post, so won't be edge cached
    * @param route RPC route
    * @param foo function
    */
   handleRRoute0(route:string, foo:Function) {
      this.appInst.post(route, foo)
   }

   /**
    * Will be edge cached
    * @param path 
    */
   serveStatic(path:string) {
      this.appInst.use(express.static(path))
   }

   /**
    * Start server
    * @param port 
    */
   listen(port:number) {
      this.appInst.listen(port, () => {
         console.info('server running on port:', port)
      })
   }
}//class

export class RPCBasicAuth {

   auth(user, password) {

      // base64 encode
      let buffUser = new Buffer(user)
      user = buffUser.toString('base64')
      let buffPwd = new Buffer(password)
      password = buffPwd.toString('base64')

      return (request, response, next) => {
         if (typeof request.fields.user === 'undefined'
            || typeof request.fields.pswd === 'undefined'
         ) {
            console.info('user or pswd not exist');
            response.status(401).send();
         } else if (request.fields.user !== user
            || request.fields.pswd !== password
         ) {
            console.info('user or pswd are not correct');
            response.status(401).send();
         } else {
            console.info('basic auth: success');
            return next();
         }
      }

   }//()
}//


module.exports = {
   ExpressRPC, RPCBasicAuth
}
