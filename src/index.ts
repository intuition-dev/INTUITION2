import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { Wa } from 'mbake/lib/Wa';
import { AdminRoutes } from './lib/admin';
import { ADB } from './lib/ADB';
import { EmailJs } from './lib/EmailJs';
const adbDB = new ADB()

const bodyParser = require("body-parser");
const mainApp = ExpressRPC.makeInstance(['http://localhost:9081']);
const appPORT = '9081';


const fs = require('fs')
const pathToDb = 'ADB.sqlite'

mainApp.use(bodyParser.json());
mainApp.use(bodyParser.text());
mainApp.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express

const emailJs = new EmailJs();

try {
   if (fs.existsSync(pathToDb)) {
      //file exists
      // mainApp.use(ExpressRPC.serveStatic('.'));
      /*
      * E D I T O R S
      */
      adbDB.createNewADBwSchema('ADB.sqlite')
      const editorRoutes = new EditorRoutes();
      mainApp.use('/api/editors', editorRoutes.routes(adbDB));
      mainApp.use('/editors', ExpressRPC.serveStatic('www'));


      // Wa.watch('/Users/liza/work/mbakeCLI/CMS', 9082);

      /*
      * A D M I N
      */

      const adminRoutes = new AdminRoutes();
      mainApp.use('/api/admin', adminRoutes.routes(adbDB));
      mainApp.use('/admin', ExpressRPC.serveStatic('wwwAdmin'));

      //open admin and editor
   } else {
      fs.open('ADB.sqlite', 'w', runSetup);
   }

} catch (err) {
}


function runSetup() {
   mainApp.use('/setup', ExpressRPC.serveStatic('setup'));
   adbDB.createNewADBwSchema('ADB.sqlite')
   const editorRoutes = new EditorRoutes();
   mainApp.use('/api/editors', editorRoutes.routes(adbDB));
   mainApp.use('/editors', ExpressRPC.serveStatic('www'));
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

         emailJs.send('liza.kislyakova@gmail.com', email, emailjsService_id, emailjsTemplate_id, emailjsUser_id);
         resp['result'] = 'OK'
         return res.json(resp)

      } catch (err) {
         // next(err);
      }
   } else {
      return res.json(resp);
   }
});



mainApp.listen(appPORT, () => {
   console.log(`mainApp listening on port ${appPORT}!`);

   console.log(`======================================================`);
   console.log(`App is running at http://localhost:${appPORT}/editors/`);
   console.log(`Admin is running at http://localhost:${appPORT}/admin/`);
   console.log(`======================================================`);
});