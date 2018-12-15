module.exports = (() => {
    const firebaseAdmin = require("firebase-admin");
    const serviceAccount = require('./serviceAccountKey.json');
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount)
    });
    return firebaseAdmin;
})();
