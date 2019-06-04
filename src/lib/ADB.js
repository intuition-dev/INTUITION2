"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite = require("sqlite");
const bcrypt = require('bcryptjs');
class ADB {
    async createNewADBwSchema(dbPath) {
        console.info("--dbPath:", dbPath);
        const dbPro = sqlite.open(dbPath);
        this.db = await dbPro;
        this.db.configure('busyTimeout', 2 * 1000);
    }
    isUserAuth(userEmail, pswdHash) {
        return 'editor';
    }
    async addAdmin(email, password, emailjs, pathToSite) {
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);
        await this.db.run(`CREATE TABLE admin(email,password,emailJsCode, pathToSite)`);
        await this.db.run(`INSERT INTO admin(email, password, emailJsCode, pathToSite) VALUES('${email}', '${hashPass}', '${emailjs}', '${pathToSite}')`, function (err) {
            if (err) {
            }
        });
    }
    validateEmail() { }
}
exports.ADB = ADB;
