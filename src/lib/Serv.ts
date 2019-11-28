import { Response, Request } from "express"

// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

const express = require('express')
const serveStatic = require('serve-static')
const lz = require('lz-string')
const URL = require('url')

//log
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Serv"})

export class CustomCors {

   constructor(validOrigins:Array<string>) {

      return (request, response, next) => {
         const origin = request.get('origin')
         const origin2= request.headers.origin

         log.info(origin, origin2)
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
Handler class
This is called by the RPC router
*/
export class BaseRPCMethodHandler {

   /**
    * @param resp 
    * @param result 
    * @param broT careful: defaults to 1, should be larger than cdnT, maybe 0 is best for your cache
    * @param cdnT careful: defaults to 1, maybe 0 is best for your cache
    */
   ret(resp:Response, result, broT?, cdnT?) {
      if(!broT) broT = 1
      if(!cdnT) cdnT = 1

      const ret:any= {} // new return
      ret.result = result

      resp.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)
      resp.setHeader('x-intu-ts', new Date().toISOString() )

      let json = JSON.stringify(ret)
      resp.status(200).send(lz.compress(json))
   }//()

   /**
    * @param resp 
    * @param msg 
    * @param broT careful: defaults to 1, maybe 0 is best for your cache
    * @param cdnT careful: defaults to 1, maybe 0 is best for your cache
    */
   retErr(resp:Response, msg, broT?, cdnT?) {
      if(!broT) broT = 1
      if(!cdnT) cdnT = 1

      if((!msg) || msg.length < 1) throw new Error('no message')
      log.warn(msg)
      const ret:any= {} // new return
      ret.errorLevel = -1
      ret.errorMessage = msg

      resp.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)
      resp.setHeader('x-intu-ts', new Date().toISOString() )

      let json = JSON.stringify(ret)
      resp.status(200).send(lz.compress(json))
   }//()

   /**
    * In the background this method dynamically invokes the called method
    * @param req 
    * @param resp 
    */
   handleRPC(req:Request, resp:Response) {
      if(!this) throw new Error('bind of class instance needed')
      const THIZ = this
      let method
      let qstr
      try {

         qstr = URL.parse(req.url, true).query
         let compressed = qstr['p']
         let str = lz.decompressFromEncodedURIComponent(compressed)

         const params = JSON.parse(str)
         method = params.method
         
         if(typeof THIZ[method] != 'function') {
            this.retErr(resp, 'no such method '+ method)
            return
         }

         //invoke the method request
         THIZ[method](resp, params)

      } catch(err) {
         log.info(err)
         THIZ.retErr(resp, qstr, null, null)
      }
   }//()

}//class

class LogHandler extends BaseRPCMethodHandler {
   _foo
   constructor(foo) {
      super()
      this._foo = foo
   }

   async log(resp, params) {// 'log', 'log'
      await this._foo(params)
      let json = JSON.stringify('logged')
      resp.status(200).send(lz.compress(json))
   }
}//()

/**
 * Should be single socket for everything.
 * Don't use methods here for Upload, use the expInst property to do it 'manually'
 */
export class Serv {
   
   static _expInst // forces single port in case of static content

   _origins:Array<string>

   /**
    * @param origins An array of string that would match a domain. So host would match localhost. eg ['*'] 
    */
   constructor(origins:Array<string>) {
      this._origins = origins

      // does it already exist?
      if(Serv._expInst) throw new Error( 'one instance of express app already exists')
      log.info('Allowed >>> ', origins)
      const cors = new CustomCors(origins)
      Serv._expInst = express()

      // Serv._expInst.set('trust proxy', true)

      Serv._expInst.use(cors)

   }//()

   setLogger(foo) {
      this.routeRPC('log', new LogHandler(foo) )
   }

   /**
    * Route to a handler
    * @param route 
    * @param foo 
   */
   routeRPC(route:string, handler:BaseRPCMethodHandler) {
      const r: string = '/'+route  

      Serv._expInst.get(r, handler.handleRPC.bind(handler))
   }

   /**
    * Set the cache header and time
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
      Serv._expInst.use((req, res, next) => {
         if (req.path.endsWith('.ts') || req.path.endsWith('.pug') ) {
            res.status(403).send('forbidden')
         } else
         next()
      })

      Serv._expInst.use(serveStatic(path, {
         setHeaders: function(res, path) {
            if (serveStatic.mime.lookup(path) === 'text/html') { }
            res.setHeader('Cache-Control', 'public, max-age='+broT+', s-max-age='+cdnT)

            // dynamic is less cache, only 5 minutes
            if (path.endsWith('.yaml') || path.endsWith('.json')) {
               res.setHeader('Cache-Control', 'public, max-age='+300+', s-max-age='+299)
            }

            res.setHeader('x-intu-ts', new Date().toISOString() )

         }
      }))//use

   }//()

   /**
    * Start server
    * @param port 
    */
   listen(port:number) {
      Serv._expInst.listen(port, () => {
         log.info('services running on port:', port)
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
   Serv, BaseRPCMethodHandler
}
