const basicAuth = require('express-basic-auth');
const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const admin = require("firebase-admin");
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
console.log(config);
const server = express();
server.use(cors());
server.use(basicAuth({
    users: { 'admin': config.secret }
}));
let fbServiceAccount = new Object(JSON.parse(fs.readFileSync("auth-f959b-96034aadd9c1.json")));
admin.initializeApp({
    credential: admin.credential.cert(fbServiceAccount)
});
admin.auth().listUsers()
    .then(function (listUsersResult) {
    listUsersResult.users.forEach(function (userRecord) {
        console.log("user", userRecord.toJSON());
    });
})
    .catch(function (error) {
    console.log("Error listing users:", error);
});
