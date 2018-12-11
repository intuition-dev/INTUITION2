module.exports = function (request, response, next) {
    const firebaseAdmin = require('./firebaseAdmin');
    let idToken = request.get('fb-auth-token');
    if (typeof idToken === 'undefined') {
        return response.status(401).send();
    }
    return firebaseAdmin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
        return next();
    }).catch(function (error) {
        console.log('error', error);
        return response.status(401).send();
    });
};
