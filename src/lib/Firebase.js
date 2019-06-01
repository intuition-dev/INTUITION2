"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/../config.yaml'));
class Firebase {
    get() {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            console.info(config);
            firebase.initializeApp({
                apiKey: config.FB_API_KEY,
                authDomain: config.FB_AUTH_DOMAIN,
                projectId: config.FB_PROJECT_ID
            });
        }
        return firebase;
    }
}
exports.Firebase = Firebase;
module.exports = {
    Firebase
};
