"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin_1 = require("./firebaseAdmin");
class EditorAuth {
    auth() {
        return (request, response, next) => {
            const firebaseAdmin = new firebaseAdmin_1.FirebaseAdmin();
            let idToken = request.get('fb-auth-token');
            if (typeof idToken === 'undefined') {
                return response.status(401).send();
            }
            return firebaseAdmin.get().auth().verifyIdToken(idToken)
                .then(function () {
                return next();
            }).catch(function (error) {
                console.info('error', error);
                return response.status(401).send();
            });
        };
    }
    ;
}
exports.EditorAuth = EditorAuth;
module.exports = {
    EditorAuth
};
