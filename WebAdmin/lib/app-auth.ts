import { FirebaseAdmin } from "./firebaseAdmin";
import { Ver} from 'mbake/lib/Base';

export class AppAuth {
    auth() {
        return (request, response, next) => {
            const firebaseAdmin = new FirebaseAdmin();

            let mbakeVer = new Ver();
            response.setHeader('mbake-ver', mbakeVer.ver())
            console.info('mbake version: ', mbakeVer.ver());
            
            // interceptor check token
            let idToken = request.get('fb-auth-token');
            if (typeof idToken === 'undefined') {
                return response.status(401).send();
            }
            return firebaseAdmin.get().auth().verifyIdToken(idToken)
                .then(function() {
                    return next();
                }).catch(function(error) {
                    console.info('error', error);
                    return response.status(401).send();
                });
        }
    };
}

module.exports = {
    AppAuth
}