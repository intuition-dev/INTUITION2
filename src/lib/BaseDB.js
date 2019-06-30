"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('tracer').console();
class BaseDB {
    _run(stmt, ...args) {
        return new Promise(function (resolve, reject) {
            stmt.run(args, function (err) {
                if (err) {
                    logger.trace(err);
                    reject(err);
                }
                else
                    resolve('okr');
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
exports.BaseDB = BaseDB;
module.exports = {
    BaseDB
};
