"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require('./Firebase');
let auth = app.auth();
exports.db1 = app.firestore();
exports.db1.settings({
    timestampsInSnapshots: true
});
function isUserIn() {
    if (!auth.currentUser)
        return false;
    return auth.currentUser.emailVerified;
}
function sendEmailVerification() {
    if (!isUserIn()) {
        console.log('sending', auth.currentUser);
        auth.currentUser.sendEmailVerification();
    }
    else {
        console.log('no currentUser');
    }
}
auth.onAuthStateChanged(user_ => {
    if (isUserIn()) {
        console.log('CRUDauth', isUserIn());
    }
    else {
        console.log('CRUDauth', 'bye');
    }
});
