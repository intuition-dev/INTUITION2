"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditorAuth {
    constructor() {
        this.firebaseAdmin = require('./firebaseAdmin');
    }
    auth() {
        return (request, response, next) => {
            let idToken = request.get('fb-auth-token');
            if (typeof idToken === 'undefined') {
                return response.status(401).send();
            }
            return this.firebaseAdmin.auth().verifyIdToken(idToken)
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
