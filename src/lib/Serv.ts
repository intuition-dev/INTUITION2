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
      if(pgOrScreen.length < 1) throw new Error('Each RPC should be called by a named page or screen')
      const r: string = '/'+route  + '/'+pgOrScreen
      this.appInst.post(r, foo)
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

export  interface iAuth {

   /**
    * Rejects 'NO' if not. Else returns some string saying what kind of auth. Eg: 'admin' for full. Or 'microsoft' would mean only for that company. 
    * @param user 
    * @param pswd 
    * @param resp response, optionally the auth class does the http response
    * @param ctx Optional context, for example project|company. Is the user allowed in this project|company?
    */
   auth(user:string, pswd:string, resp?, ctx?):Promise<string>

   retErr(resp, msg) 
   
}

/*
Helper/Sugar class
*/
export class BasePgRouter {

   /**
    * returns a data response
    * @param resp http response
    * @param result data
    */
   ret(resp, result) {
      const ret:any= {} // new return
      ret.result = result
      resp.json(ret)
   }//()

   /**
    * returns an error
    * @param resp http response
    * @param msg error msg
    */
   retErr(resp, msg) {
      logger.warn(msg)
      const ret:any= {} // new return
      ret.errorLevel = -1
      ret.errorMessage = msg
      resp.json(ret)
   }//()

   /**
    * Dynamically invokes RPC method for a Page, acts like a switch()
      eg: mainEApp.handleRRoute('api', 'editors', pg1Router.route)
    * @param req 
    * @param resp 
    */
   route(req, resp) {
      if(!this) throw new Error('bind of class instance needed')
      const THIZ = this
      let method
      try {
         const user = req.fields.user
         const pswd = req.fields.pswd
      
         method = req.fields.method
         const params = JSON.parse( req.fields.params )
         logger.info(method)
         //invoke the method request
         THIZ[method](resp, params, user, pswd)
      } catch(err) {
         logger.info(err)
         THIZ.retErr(resp, method)
      }
   }//()

   /* XXX eg how to use: mainEApp.handleRRoute('api', 'editPg', pg1Router.route.bind(pg1Router))
   selectAll(resp, params, user, pswd) {
      this.ret(resp, 'OK')
   }//()
   */

}//class

module.exports = {
   ExpressRPC, BasePgRouter
}
