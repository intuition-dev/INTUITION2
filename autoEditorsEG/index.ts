const express = require('express')
const appE = express()

appE.get('/one', function (req, res) {
   res.json({"foo": "bar"})
})
var server1 = appE.listen(8080, function() {
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

