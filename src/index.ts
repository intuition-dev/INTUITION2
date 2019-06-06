#!/usr/bin/env node
// All rights reserved by Metabake.org, licensed under LGPL 3.0

import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { AdminRoutes } from './lib/admin';
import { ADB } from './lib/ADB';
import { Email } from './lib/Email';
const fs = require('fs-extra')
const adbDB = new ADB()

const bodyParser = require("body-parser");
const appPORT = '9081';
const mainApp = ExpressRPC.makeInstance(['http://localhost:'+appPORT]);

const pathToDb = 'ADB.sqlite'

mainApp.use(bodyParser.json());
mainApp.use(bodyParser.text());
mainApp.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express

const emailJs = new Email();

try {
   if (adbDB.checkDB(pathToDb)) {

      //file exists
      /*
      * E D I T O R S
      */
      adbDB.createNewADBwSchema(pathToDb)
      const editorRoutes = new EditorRoutes();
      mainApp.use('/api/editors', editorRoutes.routes(adbDB));
      mainApp.use('/editors', ExpressRPC.serveStatic('www'));


      /*
      * A D M I N
      */
      const adminRoutes = new AdminRoutes();
      mainApp.use('/api/admin', adminRoutes.routes(adbDB));
      mainApp.use('/admin', ExpressRPC.serveStatic('wwwAdmin'));

      //open admin and editor
   } else { // VIC: I don't understand what next line does, if DB does not exists, open path?
      fs.open(pathToDb, 'w', runSetup);
   }

} catch (err) {
   console.log(err)
}


function runSetup() {
   mainApp.use('/setup', ExpressRPC.serveStatic('setup'));
   adbDB.createNewADBwSchema(pathToDb)
   const editorRoutes = new EditorRoutes();
   mainApp.use('/api/editors', editorRoutes.routes(adbDB));
   mainApp.use('/editors/', ExpressRPC.serveStatic('www'));
   const adminRoutes = new AdminRoutes();
   mainApp.use('/api/admin', adminRoutes.routes(adbDB));
   mainApp.use('/admin', ExpressRPC.serveStatic('wwwAdmin'));
}

mainApp.post("/setup", async (req, res) => {
   const method = req.fields.method;
   let params = JSON.parse(req.fields.params)

   let email = params.email
   let password = params.password
   let emailjsService_id = params.emailjsService_id
   let emailjsTemplate_id = params.emailjsTemplate_id
   let emailjsUser_id = params.emailjsUser_id
   let pathToSite = params.pathToSite

   let resp: any = {}; // new response that will be set via the specific method passed
   if ('setup' == method) {
      resp.result = {}
      // res.send(resp)
      try {
         console.info('setup called ...');
         adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite);
         console.info('db cretated  ...');
         let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
         emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
         resp['result'] = 'OK'
         return res.json(resp)

      } catch (err) {
         // next(err);
      }
   } else {
      return res.json(resp);
   }
})

mainApp.listen(appPORT, () => {

   console.log(`======================================================`);
   console.log(`App is running at http://localhost:${appPORT}/editors/`);
   console.log(`======================================================`);
})
