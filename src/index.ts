import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { Wa } from 'mbake/lib/Wa';
import { AdminRoutes } from './lib/admin';
import { ADB } from './lib/ADB';

const bodyParser = require("body-parser");
const mainAppG = ExpressRPC.makeInstance(['http://localhost:9080']);
const appGPORT = '9081';

const fs = require('fs')
const pathToDb = 'ADB.sqlite'
const config_port = 3100

mainAppG.use(bodyParser.json());
mainAppG.use(bodyParser.text());
mainAppG.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express


try {
   if (fs.existsSync(pathToDb)) {
      //file exists
      // mainAppG.use(ExpressRPC.serveStatic('.'));
      /*
      * E D I T O R S
      */

      const editorRoutes = new EditorRoutes();
      mainAppG.use('/api/editors', editorRoutes.routes());
      mainAppG.use('/editors', ExpressRPC.serveStatic('www'));


      // Wa.watch('/Users/liza/work/mbakeCLI/CMS', 9082);

      /*
      * A D M I N
      */

      const adminRoutes = new AdminRoutes();
      mainAppG.use('/api/admin', adminRoutes.routes());
      mainAppG.use('/admin', ExpressRPC.serveStatic('wwwAdmin'));

      //open admin and editor
   } else {
      fs.open('ADB.sqlite', 'w', runSetup);
      // fs.writeFile('ADB.sqlite', '', runSetup)
   }

} catch (err) {
}

function runSetup() {
   mainAppG.use('/setup', ExpressRPC.serveStatic('setup'));
   // mainAppG.use(ExpressRPC.serveStatic('setup'));
}

mainAppG.post("/setup", async (req, res) => {
   const method = req.fields.method;
   let params = JSON.parse(req.fields.params)

   let email = params.email

   let password = params.password
   var salt = bcrypt.genSaltSync(10);
   var hashPass = bcrypt.hashSync(password, salt);

   // guid for pk client side 
   // eg: bcrypt randomBytes(16).toString("hex") or base64, or Math.random to make base64 char 16 times
   // also to email a random # 
   let emailjs = params.emailjs
   let pathToSite = params.pathToSite

   let resp: any = {}; // new response that will be set via the specific method passed
   if ('setup' == method) {
      resp.result = {}
      // res.send(resp)

      try {
         await ADB.createNewADBwSchema()

         await db.run(`CREATE TABLE admin(email,password,emailJsCode, pathToSite)`);
         await db.run(`INSERT INTO admin(email, password, emailJsCode, pathToSite) VALUES('${email}', '${hashPass}', '${emailjs}', '${pathToSite}')`, function (err) {
            if (err) {
            }
            // get the last insert id
         });
      } catch (err) {
         // next(err);
      }
   } else {
      return res.json(resp);
   }
});


mainAppG.listen(appGPORT, () => {
   console.log(`mainAppG listening on port ${appGPORT}!`);

   console.log(`======================================================`);
   console.log(`App is running at http://localhost:${appGPORT}/editors/`);
   console.log(`Admin is running at http://localhost:${appGPORT}/admin/`);
   console.log(`======================================================`);
});