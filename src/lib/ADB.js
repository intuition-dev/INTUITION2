"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const bcrypt = require('bcryptjs');
class ADB {
    async createNewADBwSchema(adminEmail, emailJsCode) {
        const dbPro = sqlite_1.default.open('./db/ADB.sqlite');
        this.db = await dbPro;
        this.db.configure('busyTimeout', 2 * 1000);
    }
    isUserAuth(userEmail, pswdHash) {
        return 'editor';
    }
    validateEmail() { }
}
exports.ADB = ADB;
module.exports = {
    ADB
};
