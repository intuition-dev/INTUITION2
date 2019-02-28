"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.info(process.env.FB_API_KEY);
class Firebase {
    get() {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: process.env.FB_API_KEY,
                authDomain: process.env.FB_AUTH_DOMAIN,
                projectId: process.env.FB_PROJECT_ID
            });
        }
        return firebase;
    }
}
exports.Firebase = Firebase;
module.exports = {
    Firebase
};
