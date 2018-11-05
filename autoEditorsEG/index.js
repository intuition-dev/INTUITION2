const express = require('express');
const app1 = express();
app1.get('/one', function (req, res) {
    res.json({ "foo": "bar" });
});
var server1 = app1.listen(8080, function () {
    console.log('Ready on port %d', server1.address().port);
});
var admin = require("firebase-admin");
const fs = require('fs');
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
