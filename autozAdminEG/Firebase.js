module.exports = (() => {
    const firebase = require("firebase");
    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: 'AIzaSyANgUiulqhb4AweQ26cng9jdo_mz_LJhYg',
            authDomain: 'alan-project-dev-5da15.firebaseapp.com',
            projectId: 'alan-project-dev-5da15'
        });
    }
    return firebase;
})();
