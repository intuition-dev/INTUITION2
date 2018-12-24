"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Firebase_1 = require("./Firebase");
const firebase = new Firebase_1.Firebase();
exports.db1 = firebase.get().firestore();
exports.db1.settings({
    timestampsInSnapshots: true
});
