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
    async addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite) {
        let randomID = '_' + Math.random().toString(36).substr(2, 9);
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);
        await this.db.run(`CREATE TABLE admin(id, email,password,emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite, vcode)`);
        await this.db.run(`CREATE TABLE editors(id,email,password,name,emailjsService_id, emailjsTemplate_id, emailjsUser_id)`);
        await this.db.run(`INSERT INTO admin(id, email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite) VALUES('${randomID}','${email}', '${hashPass}', '${emailjsService_id}', '${emailjsTemplate_id}', '${emailjsUser_id}', '${pathToSite}')`, function (err) {
            if (err) {
            }
        });
    }
    validateEmail(email, password) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get(`SELECT password FROM admin WHERE email=?`, email, function (err, row) {
                if (err) {
                }
                return row;
            }).then(function (row) {
                bcrypt.compare(password, row.password, function (err, res) {
                    console.info("--res:", res);
                    resolve(res);
                });
            });
        });
    }
    validateEditorEmail(email, password) {
        return new Promise(this.db.get(`SELECT password FROM editor WHERE email=?`, email, function (err, row) {
            if (err) {
            }
            return row;
        }).then(function (row) {
            bcrypt.compare(password, row.password, function (err, res) {
                return res;
            });
        }));
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
        let randomID = '_' + Math.random().toString(36).substr(2, 9);
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);
        return this.db.run(`INSERT INTO editors(id,email, password, name) VALUES('${randomID}','${email}', '${hashPass}', '${name}')`, function (err) {
            if (err) {
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            return this.lastID;
        });
    }
    async sendVcode(email) {
        let vcode = '1234';
        await this.db.run(`UPDATE admin SET vcode='${vcode}' WHERE email='${email}'`, function (err, rows) {
            if (err) {
                console.info("--err:", err);
            }
            return rows;
        });
    }
    async resetPassword(email, vcode, password) {
        let res = await this.db.run(`UPDATE admin SET password='${password}' WHERE email='${email}' AND vcode='${vcode}'`);
        if (res.changes > 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.ADB = ADB;
