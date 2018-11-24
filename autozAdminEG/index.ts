

import basicAuth = require('express-basic-auth');
import express = require('express');
import cors = require('cors');
import yaml = require('js-yaml');

import admin = require("firebase-admin");
import fs = require('fs');

let config = yaml.load(fs.readFileSync(__dirname +'/config.yaml'))
console.log(config)

const appA = express()
appA.use(cors())
appA.use(basicAuth({
   users: { 'admin': config.secret }
}))

let fbServiceAccount = new Object(JSON.parse(fs.readFileSync("auth-f959b-96034aadd9c1.json").toString()))
//console.log(fbServiceAccount)

admin.initializeApp({
  credential: admin.credential.cert(fbServiceAccount)
})

/*
admin.auth().createUser({
   email: "user2@example.com",
   password: "secretPassword",
   displayName: "John Doe"
 })
   .then(function(userRecord) {
     // See the UserRecord reference doc for the contents of userRecord.
     console.log("Successfully created new user:", userRecord.uid);
   })
   .catch(function(error) {
     console.log("Error creating new user:", error);
   });
*/

admin.auth().listUsers()
   .then(function(listUsersResult) {
      //console.log(listUsersResult)
      listUsersResult.users.forEach(function(userRecord) {
      console.log("user", userRecord.toJSON())
      })
   })
   .catch(function(error) {
      console.log("Error listing users:", error)
   })

// https://stackoverflow.com/questions/50370925/firebase-authentication-using-nodejs

