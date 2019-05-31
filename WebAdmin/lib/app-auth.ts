import { FirebaseAdmin } from "./firebaseAdmin";
import { Ver } from 'mbake/lib/Base';

export class AppAuth {
    auth() {
        return (request, response, next) => {
            const firebaseAdmin = new FirebaseAdmin();
            const params = JSON.parse(request.fields.params)
            const resp: any = {} // new response that will be set via the specific method passed

            //TODO
            // response.setHeader('mbake-ver', Ver.ver());
            console.info('mbake version: ', Ver.ver());

            // interceptor check token
            let idToken = params['fb-auth-token'];
            if (typeof idToken === 'undefined') {
                return response.status(401).send();
            }
            return firebaseAdmin.get().auth().verifyIdToken(idToken)
                .then(function() {
                    return next();
                }).catch(function(error) {
                    resp.errorLevel = -1
                    resp.errorMessage = error
                    console.log('noway', resp)
                    return response.json(resp)
                });
        }
    };
}

module.exports = {
    AppAuth
}