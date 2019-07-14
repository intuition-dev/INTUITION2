"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('tracer').console();
class BaseDB {
    constructor() {
        BaseDB.instance++;
        if (BaseDB.instance > 1)
            console.warn('extra instance of DB', BaseDB.instance);
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
