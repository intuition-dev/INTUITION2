const express = require('express')
const app1 = express()

app1.get('/one', function (req, res) {
   res.json({"foo": "bar"})
})
var server1 = app1.listen(8080, function() {
   console.log('Ready on port %d', server1.address().port);
})
 ///////////////////////////

var admin = require("firebase-admin");
const fs = require('fs')

let fbServiceAccount = new Object(JSON.parse(fs.readFileSync("auth-f959b-96034aadd9c1.json")))
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

