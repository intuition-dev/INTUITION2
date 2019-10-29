
// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

const express = require('express')
const serveStatic = require('serve-static')
// const lz = require('lz-string')
const URL = require('url')

const bunyan = require('bunyan')
const log = bunyan.createLogger({name: "class name"})

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
      log.info(original)

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
    * @param resp 
    * @param result 
    * @param broT careful: defaults to 1, should be larger than cdnT, maybe 0 is best for your cache
    * @param cdnT careful: defaults to 1, maybe 0 is best for your cache
    */
   ret(resp, result, broT?, cdnT?) {
      if(!broT) broT = 1
      if(!cdnT) cdnT = 1

      const ret:any= {} // new return
      ret.result = result

      resp.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)
      resp.setHeader('x-intu-ts', new Date().toISOString() )

      resp.json(ret)
   }//()

   /**
    * @param resp 
    * @param msg 
    * @param broT careful: defaults to 1, maybe 0 is best for your cache
    * @param cdnT careful: defaults to 1, maybe 0 is best for your cache
    */
   retErr(resp, msg, broT?, cdnT?) {
      if(!broT) broT = 1
      if(!cdnT) cdnT = 1

      log.warn(msg)
      const ret:any= {} // new return
      ret.errorLevel = -1
      ret.errorMessage = msg

      resp.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)
      resp.setHeader('x-intu-ts', new Date().toISOString() )

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

         const user = params.user
         const pswd = params.pswd
         const token = params.token

         method = params.method
         ent = params.ent
         
         //invoke the method request
         THIZ[method](resp, params, ent, user, pswd, token)

      } catch(err) {
         log.info(err)
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
      log.info('Allowed >>> ', origins)
      const cors = new CustomCors(origins)
      ExpressRPC._appInst = express()

      ExpressRPC._appInst.set('trust proxy', true)

      this.appInst.use(cors)

   }

   /**
    * @param route 
    * @param pgOrScreen 
    * @param foo 
      serviceApp.routeRPC('api', 'pageOne', (req, res) => { 

         const params = URL.parse(req.url, true).query
         log.info(params)
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
            params['date'] =  new Date().toISOString()
 
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
      
      log.info('Serving root:', path, broT, cdnT)

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

            res.setHeader('x-intu-ts', new Date().toISOString() )

         }//setHeader()
      }))//use

   }//()

   /**
    * Start server
    * @param port 
    */
   listen(port:number) {
      this.appInst.listen(port, () => {
         log.info('server running on port:', port)
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
