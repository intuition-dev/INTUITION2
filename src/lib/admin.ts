import { ExpressRPC, RPCBasicAuth } from 'mbake/lib/Serv';
import axios from 'axios';

export class AdminRoutes {
   routes(adbDB) {
      const bodyParser = require("body-parser");

      const adminApp = ExpressRPC.makeInstance(['http://localhost:9081']);
      adminApp.use(bodyParser.json());

      adminApp.use((request, response, next) => {
         const params = JSON.parse(request.fields.params)
         const resp: any = {} // new response that will be set via the specific method passed


         let email = params.admin_email
         let password = params.admin_pass
         try {
            var pass = adbDB.validateEmail(email)
            if (pass) {
               next()
            }

         } catch (err) {
            // next(err);
         }
      });

      adminApp.post('/checkAdmin', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)
         let email = params.admin_email
         let password = params.admin_pass

         let resp: any = {};

         if ('check-admin' == method) {
            resp.result = {}
            // res.send(resp)

            try {
               var pass = adbDB.validateEmail(email, password)
               if (pass) {
                  resp['pass'] = true
                  return res.json(resp)
               } else {
                  resp['pass'] = false
                  return res.json(resp)
               }

            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      })
      // // get users
      adminApp.post("/editors", (req, res) => {
         const method = req.fields.method;
         let resp: any = {}; // new response that will be set via the specific method passed

         if ('get' == method) {

            adbDB.getEditors()
               .then(function (editors) {
                  let data = []
                  editors.map(function (editor) {
                     data.push({
                        id: editor.id,
                        email: editor.email,
                        name: editor.name
                     });
                  })
                  resp.result = data;
                  return res.json(resp);
               })
         } else {

            return res.json(resp);

         }

      });

      // // add user
      adminApp.post("/editors-add", (req, res) => {
         const method = req.fields.method;
         let resp: any = {}; // new response that will be set via the specific method passed
         let params = JSON.parse(req.fields.params);

         if ('post' == method) {

            let email = params.email;
            let name = params.name;
            let password = params.password;
            if (typeof email !== 'undefined' &&
               typeof name !== 'undefined' &&
               typeof password !== 'undefined'
            ) {

               adbDB.addEditor(email, name, password)
                  .then(function (editorId) {
                     let response = {
                        id: editorId
                     }
                     resp.result = response;
                     return res.json(resp);
                  })
            } else {
               res.status(400);
               resp.result = { error: 'parameters missing' };
               res.json(resp);
            }

         } else {

            return res.json(resp);

         }

      });

      // // edit user
      // adminApp.post("/editors-edit", (req, res) => {
      //    const method = req.fields.method;
      //    let resp: any = {}; // new response that will be set via the specific method passed
      //    let params = JSON.parse(req.fields.params);

      //    if ('put' == method) {

      //       let name = params.name;
      //       let userId = params.uid;
      //       if (typeof name !== 'undefined' &&
      //          typeof userId !== 'undefined'
      //       ) {
      //          firebaseAdmin.get().auth().updateUser(userId, {
      //             displayName: name
      //          }).then(function (userRecord) { // send response to client
      //             // See the UserRecord reference doc for the contents of userRecord.
      //             let response = {
      //                id: userRecord.uid
      //             }
      //             resp.result = response;
      //             res.json(resp);
      //          }).catch(function (error) {
      //             res.status(400);
      //             resp.result = { error: error.message };
      //             res.json(resp);
      //          });
      //       } else {
      //          res.status(400);
      //          resp.result = { error: 'parameters missing' };
      //          res.json(resp);
      //       }

      //    } else {

      //       return res.json(resp);

      //    }

      // });

      // // delete user
      // adminApp.post("/editors-delete", (req, res) => {
      //    const method = req.fields.method;
      //    let resp: any = {}; // new response that will be set via the specific method passed
      //    let params = JSON.parse(req.fields.params);

      //    if ('delete' == method) {
      //       let userId = params.uid;
      //       if (typeof userId !== 'undefined') {
      //          firebaseAdmin.get().auth().deleteUser(userId)
      //             .then(function () {
      //                dbAdminFs.collection('editors')
      //                   .doc(userId)
      //                   .delete()
      //                   .then(() => {
      //                      resp.result = {};
      //                      res.json(resp);
      //                   })
      //             })
      //             .catch(function (error) {
      //                res.status(400);
      //                resp.result = { error: error.message };
      //                res.json(resp);
      //             });
      //       } else {
      //          res.status(400);
      //          resp.result = { error: 'parameters missing' };
      //          res.json(resp);
      //       }

      //    } else {

      //       return res.json(resp);

      //    }

      // });

      return adminApp;

   };
}

module.exports = {
   AdminRoutes
}