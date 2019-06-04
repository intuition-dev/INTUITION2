import { RPCBasicAuth } from '../lib/RPCBasicAuth';
// import { Firebase } from './Firebase';
// import { FirebaseAdmin } from "./firebaseAdmin";
import { ExpressRPC } from 'mbake/lib/Serv';

export class AdminRoutes {
   routes() {
      const bodyParser = require("body-parser");
      const yaml = require('js-yaml');
      const fs = require('fs');
      // const firebaseAdmin = new FirebaseAdmin();
      // const firebase = new Firebase();
      // const dbAdminFs = firebaseAdmin.get().firestore();
      
      let config = yaml.load(fs.readFileSync(__dirname + '/../config.yaml'));
      
      const basicAuthRpc = new RPCBasicAuth();
      const adminApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
      adminApp.use(bodyParser.json());

      adminApp.use(basicAuthRpc.auth('admin', '123456'));
      
      // // get users
      // adminApp.post("/editors", (req, res) => {
      //    const method = req.fields.method;
      //    let resp: any = {}; // new response that will be set via the specific method passed

      //    if ('get' == method) {

      //       let editorsCollection = dbAdminFs.collection('editors');
      //       let adminAuth = firebaseAdmin.get().auth();
      //       editorsCollection
      //          .get()
      //          .then(editors => {
      //             let data = [];
      //             // map instead of foreach returns array of promises
      //             Promise.all(editors.docs.map(editor => {
      //                return adminAuth.getUser(editor.id)
      //                   .then(userRef => {
      //                      data.push({
      //                         id: editor.id,
      //                         email: userRef.email,
      //                         name: userRef.displayName
      //                      });
      //                   }).catch(e => {
      //                      console.info("no users found");
      //                   })
      //             }))
      //                .then(() => {
      //                   resp.result = data;
      //                   res.json(resp);
      //                });
      //          })
      //          .catch(e => console.error(e.stack));
        
      //   } else {
        
      //       console.log('error', resp);
      //       return res.json(resp);
            
      //   }
        
      // });
      
      // // add user
      // adminApp.post("/editors-add", (req, res) => {
      //    const method = req.fields.method;
      //    let resp: any = {}; // new response that will be set via the specific method passed
      //    let params = JSON.parse(req.fields.params);

      //    if ('post' == method) {

      //       let email = params.email;
      //       let name = params.name;
      //       let password = params.password;
      //       if (typeof email !== 'undefined' &&
      //          typeof name !== 'undefined' &&
      //          typeof password !== 'undefined'
      //       ) {
      //          let editorRef = dbAdminFs.collection('editors').doc(); // get editor id reference
      //          firebaseAdmin
      //             .get()
      //             .auth()
      //             .createUser({ // create user
      //                email: email,
      //                displayName: name,
      //                password: password,
      //             })
      //             .then(userRecord => { // add user to editors collection
      //                return dbAdminFs.collection('editors')
      //                   .doc(userRecord.uid)
      //                   .set({
      //                      editor_id: editorRef
      //                   })
      //                   .then(_ => {
      //                      return userRecord;
      //                   });
      //             })
      //             .then(userRecord => {
      //                let firebaseAuth = firebase.get().auth();
      //                console.info('sending reset and verification email to user');
      //                return firebaseAuth.sendPasswordResetEmail(email)
      //                   .then(() => {
      //                      console.info('email has been sent to user');
      //                      return userRecord;
      //                   })
      //                   .catch(function (error) {
      //                      console.info('email hasn\'t been sent to user', error);
      //                   });
      //             })
      //             .then(function (userRecord) { // send response to client
      //                // See the UserRecord reference doc for the contents of userRecord.
      //                console.info("Successfully created new user:", userRecord.uid);
      //                let response = {
      //                   id: userRecord.uid
      //                }
      //                resp.result = response;
      //                res.json(resp);
      //             })
      //             .catch(function (error) {
      //                console.info("Error creating new user:", error);
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

      //       console.log('error', resp);
      //       return res.json(resp);

      //    }

      // });
      
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
      //             console.info("Successfully updated user", userRecord.toJSON());
      //             let response = {
      //                id: userRecord.uid
      //             }
      //             resp.result = response;
      //             res.json(resp);
      //          }).catch(function (error) {
      //             console.info("Error updating user:", error);
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

      //       console.log('error', resp);
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
      //                   .catch(e => console.error(e.stack));
      //                console.info("Successfully deleted user");
      //             })
      //             .catch(function (error) {
      //                console.info("Error deleting user:", error);
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

      //       console.log('error', resp);
      //       return res.json(resp);

      //    }

      // });
      
      return adminApp;

   };
}

module.exports = {
   AdminRoutes
}