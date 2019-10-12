
// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('express-formidable')
const serveStatic = require('serve-static')
// const lz = require('lz-string')
const URL = require('url')

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

/*
Helper class

This is called by router
*/
export class BaseRPCMethodHandler {

   /**
    * returns a data response
    * @param resp http response
    * @param result data
    */
   ret(resp, result, broT, cdnT) {
      if(!broT) broT = 0
      if(!cdnT) cdnT = 0

      const ret:any= {} // new return
      ret.result = result

      resp.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)
      resp.setHeader('X-intu-ts', Date.now() )

      resp.json(ret)
   }//()

   /**
    * returns an error
    * @param resp http response
    * @param msg error msg
    */
   retErr(resp, msg, broT, cdnT) {
      if(!broT) broT = 2
      if(!cdnT) cdnT = 1

      logger.warn(msg)
      const ret:any= {} // new return
      ret.errorLevel = -1
      ret.errorMessage = msg

      resp.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)
      resp.setHeader('X-intu-ts', Date.now() )

      resp.json(ret)
   }//()

   /**
    * Dynamically invokes a method for a entity, acts like a switch()

    * @param req 
    * @param resp 
    */
   handleRPC(req, resp) {
      if(!this) throw new Error('bind of class instance needed')
      const THIZ = this
      let method
      let ent
      let params
      try {

         params = URL.parse(req.url, true).query
         console.log(params) // Nat

         const user = params.user
         const pswd = params.pswd
         const token = params.token

         method = params.method
         ent = params.ent
         
         //invoke the method request
         THIZ[method](resp, params, ent, user, pswd, token)

      } catch(err) {
         logger.info(err)
         THIZ.retErr(resp, params, null, null)
      }
   }//()

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

      ExpressRPC._appInst.set('trust proxy', true)

      this.appInst.use(cors)

      // for old fetch:
      this.appInst.use(bodyParser.urlencoded({ extended: false }))
      this.appInst.use(formidable())// for old fetch
   }

   /**
    * @param route 
    * @param pgOrScreen 
    * @param foo 
      serviceApp.routeRPC('api', 'pageOne', (req, res) => { 

         const params = URL.parse(req.url, true).query
         console.log(params)
         const method = params.method

         if('multiply'==method) { // RPC for the page could handle several methods, eg one for each of CRUD
            let a = params.a
            let b = params.b
            const resp:any= {} // new response
            resp.result = multiply(a,b)
            handler.ret(res, resp, 4, 3)
         } else {
            const resp:any= {} // new response
            resp.errorMessage = 'mismatch'
            handler.retErr(res, resp, 4, 3)
         }
      })
      // should be class - maybe used by multiple routes
      function multiply(a,b) {
         return a*b
      
    */
   routeRPC(route:string, pgOrScreen:string, foo:Function) {
      if(pgOrScreen.length < 1) throw new Error('Each RPC should have the named page or screen argument')
      const r: string = '/'+route  
      this.appInst.get(r, foo)
   }


   static logHandler = new BaseRPCMethodHandler()
   handleLog(foo) {
      this.routeRPC('log', 'log', (req, res) => { 
         const params = URL.parse(req.url, true).query
         const method = params.method
         
         if('log'==method) { // RPC for the page could handle several methods, eg one for each of CRUD
            params['ip'] = req.ip // you may need req.ips
            params['date'] =  Date.now()
 
            foo(params)
         
            const resp:any= {} // new response
            ExpressRPC.logHandler.ret(res, resp, 2, 1)
         } else {
            const resp:any= {} // new response
            resp.errorMessage = 'mismatch'
            ExpressRPC.logHandler.retErr(res, resp, 2, 1)
         }

         })//inner
   }//()

   /**
    * 
    * @param path 
    * @param broT Bro(wser) cache time in seconds- 1800
    * @param cdnT CDN /one less in seconds- 1799
    * The longer the better! Max is 1 year in seconds ( 60*60*24*364 ). You can flush CDN at CDN and flush browser at browser.
    */
   serveStatic(path:string, broT, cdnT) {
      if(!broT ) broT = 30*60
      if(!cdnT ) cdnT = (30*60)-1 // cdn is one less than bro
      
      logger.trace('Serving root:', path, broT, cdnT)

      //filter forbidden
      this.appInst.use((req, res, next) => {
         if (req.path.endsWith('.ts') || req.path.endsWith('.pug') ) {
            res.status(403).send('forbidden')
         } else
         next()
      })

      // static
      this.appInst.use(serveStatic(path, {
         setHeaders: function(res, path) {
            if (serveStatic.mime.lookup(path) === 'text/html') { }
            res.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)

            // dynamic is less cache, only 5 minutes
            if (path.endsWith('.yaml') || path.endsWith('.json')) {
               res.setHeader('Cache-Control', 'public, max-age='+300+', s-max-age='+299)
            }

            res.setHeader('X-intu-ts', Date.now() )

         }//setHeader()
      }))//use

   }//()

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
    * Rejects with 'FAIL' if not. Else returns some string saying what kind of auth. Eg: 'admin' for full. Or 'microsoft' would mean only for that company. 
    * @param user 
    * @param pswd 
    * @param resp response, optionally the auth class does the http response
    * @param ctx Optional context, for example project|company. Is the user allowed in this project|company?
    */
   auth(user:string, pswd:string, resp?, ctx?):Promise<string>

}//i

module.exports = {
   ExpressRPC, BaseRPCMethodHandler
}
