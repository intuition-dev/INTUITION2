"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite = require("sqlite");
const bcrypt = require('bcryptjs');
class ADB {
    async createNewADBwSchema(dbPath) {
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
        await this.db.run(`CREATE TABLE editors(id,email,password,name,emailJsCode)`);
        await this.db.run(`INSERT INTO admin(email, password, emailJsCode, pathToSite) VALUES('${email}', '${hashPass}', '${emailjs}', '${pathToSite}')`, function (err) {
            if (err) {
            }
        });
    }
    validateEmail(email, password) {
        return this.db.get(`SELECT password FROM admin WHERE email=?`, email, function (err, row) {
            if (err) {
            }
            return row;
        }).then(function (row) {
            bcrypt.compare(password, row.password, function (err, res) {
                return true;
            });
        });
    }
    getEditors() {
        return this.db.all(`SELECT name, email FROM editors`, [], function (err, rows) {
            if (err) {
                console.info("--err:", err);
            }
            return rows;
        });
    }
    addEditor(email, name, password) {
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);
        return this.db.run(`INSERT INTO editors(email, password, name) VALUES('${email}', '${hashPass}', '${name}')`, function (err) {
            if (err) {
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            return this.lastID;
        });
    }
}
exports.ADB = ADB;
