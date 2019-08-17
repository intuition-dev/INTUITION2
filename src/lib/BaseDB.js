"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('tracer').console();
const fs = require('fs-extra');
const sqlite3 = require('sqlite3').verbose();
class BaseDB {
    constructor(path, fn) {
        BaseDB.instance++;
        if (BaseDB.instance > 1)
            throw new Error('extra instance of DB');
        this.path = path;
        this.fn = fn;
    }
    dbExists() {
        return fs.existsSync(this.path + this.fn);
    }
    delDb() {
        try {
            this.db.close(function () {
                fs.removeSync(this.path + this.fn);
            });
        }
        catch (err) { }
        fs.removeSync(this.path + this.fn);
    }
    con() {
        if (this.db) {
            logger.trace('connection exists');
            return;
        }
        logger.trace('new connection');
        this.db = new sqlite3.Database(this.path + this.fn);
    }
    _run(stmt, ...args) {
        return new Promise(function (resolve, reject) {
            stmt.run(args, function (err) {
                if (err) {
                    logger.trace(err);
                    reject(err);
                }
                else
                    resolve('OK');
            });
        });
    }
    _qry(stmt, ...args) {
        return new Promise(function (resolve, reject) {
            stmt.all(args, function (err, rows) {
                if (err) {
                    logger.trace(err);
                    reject(err);
                }
                else
                    resolve(rows);
            });
        });
    }
}
BaseDB.instance = 0;
exports.BaseDB = BaseDB;
module.exports = {
    BaseDB
};
