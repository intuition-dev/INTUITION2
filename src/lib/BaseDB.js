"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('tracer').console();
class BaseDB {
    constructor(path, fn) {
        BaseDB.instance++;
        if (BaseDB.instance > 1)
            throw new Error('extra instance of DB');
        this.path = path;
        this.fn = fn;
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
