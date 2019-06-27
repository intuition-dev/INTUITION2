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


export class ExpressRPC {
   
   appInst // forces single port in case of static content

   /**
    * @param origins An array of string that would match a domain. So host would match localhost. Returns express server instance.
    */
   makeInstance(origins:Array<string>) {
      console.log('Allowed >>> ', origins)
      const cors = new CustomCors(origins)
      this.appInst = express()
      this.appInst.use(cors)

      this.appInst.use(bodyParser.urlencoded({ extended: false }))
      this.appInst.use(formidable())// for fetch

      return this.appInst
   }

   serveStatic(path:string) {
      return express.static(path)
   }


}//class

export class RPCBasicAuth {
   auth(user, password) {

       // base64 encode
       let buffUser = new Buffer(user);  
       user = buffUser.toString('base64');
       let buffPwd = new Buffer(password);  
       password = buffPwd.toString('base64');

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
   };
}

module.exports = {
   ExpressRPC, RPCBasicAuth
}
