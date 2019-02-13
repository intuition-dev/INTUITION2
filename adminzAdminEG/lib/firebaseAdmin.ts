let firebaseAdmin = null;

export class FirebaseAdmin {
    get() {
        if(!firebaseAdmin){
            firebaseAdmin = require("firebase-admin");
            const serviceAccount = require('../serviceAccountKey.json');
            
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount)
            });
        }
        return firebaseAdmin;
    }
}
module.exports = {
    FirebaseAdmin
}