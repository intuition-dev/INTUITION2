var admin = require("firebase-admin");
const fs = require('fs');
let fbServiceAccount = new Object(JSON.parse(fs.readFileSync("auth-f959b-96034aadd9c1.json")));
admin.initializeApp({
    credential: admin.credential.cert(fbServiceAccount),
    databaseURL: "https://auth-f959b.firebaseio.com"
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
