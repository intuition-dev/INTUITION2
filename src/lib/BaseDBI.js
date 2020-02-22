"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
class BaseDBI {
    constructor() {
        this.log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        this.sqlite3 = require('sqlite3').verbose();
    }
    defCon(path, fn) {
        this._fn = path + fn;
        this._db = new this.sqlite3.Database(this._fn);
    }
    async read(sql, arr) {
        if (!arr)
            arr = [];
        const THIZ = this;
        let rows = new Promise(function (resolve, reject) {
            THIZ._db.all(sql, arr, function (err, rows) {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        return rows;
    }
    async readOne(sql, arr) {
        if (!arr)
            arr = [];
        const THIZ = this;
        let row = await new Promise(function (resolve, reject) {
            THIZ._db.get(sql, arr, function (err, row) {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        });
        return row;
    }
    async write(sql, arr) {
        if (!arr)
            arr = [];
        const THIZ = this;
        await new Promise(function (resolve, reject) {
            THIZ._db.run(sql, arr, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
exports.BaseDBI = BaseDBI;
BaseDBI.MAXINT = 9223372036854775807;
