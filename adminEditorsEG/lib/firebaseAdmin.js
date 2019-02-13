"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let firebaseAdmin = null;
class FirebaseAdmin {
    get() {
        if (!firebaseAdmin) {
            firebaseAdmin = require("firebase-admin");
            const serviceAccount = require('../serviceAccountKey.json');
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount)
            });
        }
        return firebaseAdmin;
    }
}
exports.FirebaseAdmin = FirebaseAdmin;
module.exports = {
    FirebaseAdmin
};
