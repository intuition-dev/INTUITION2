import { Ver, Dirs, FileOps } from 'mbake/lib/Base'

import express = require('express');
const appE = express()

appE.get('/one', function (req, res) {
   
   let dirs = new Dirs('')
   dirs.getShort()

   let fo = new  FileOps('')
   fo.read('')

   res.json({"foo": "bar"})
})


console.log(new Ver().ver())



var admin = require("firebase-admin");
import fs = require('fs');

let fbServiceAccount = new Object(JSON.parse(fs.readFileSync("auth-f959b-96034aadd9c1.json").toString()))
//console.log(fbServiceAccount)

admin.initializeApp({
  credential: admin.credential.cert(fbServiceAccount)
})


///////////////////////////
let serverA = appE.listen(8080, function() {
   console.log('Ready on port %d', serverA.address().port);
})
