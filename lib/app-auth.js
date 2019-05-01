"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin_1 = require("./firebaseAdmin");
const Base_1 = require("mbake/lib/Base");
class AppAuth {
    auth() {
        return (request, response, next) => {
            const firebaseAdmin = new firebaseAdmin_1.FirebaseAdmin();
            let mbakeVer = new Base_1.Ver();
            response.setHeader('mbake-ver', mbakeVer.ver());
            console.info('mbake version: ', mbakeVer.ver());
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
exports.AppAuth = AppAuth;
module.exports = {
    AppAuth
};
