"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileHound = require("filehound");
var logger = require('tracer').console();
var fs = require("fs-extra");
var yaml = require("js-yaml");
var path = require("path");
var Dirs = (function () {
    function Dirs(dir_) {
        var dir = Dirs.slash(dir_);
        this.dir = dir;
    }
    Dirs.slash = function (path_) {
        return path_.replace(/\\/g, '/');
    };
    Dirs.goUpOne = function (dir) {
        return path.resolve(dir, '..');
    };
    Dirs.prototype.getInDir = function (sub) {
        var rec = FileHound.create()
            .paths(this.dir + sub)
            .not().glob("*.js")
            .findSync();
        var ret = [];
        var ll = this.dir.length + sub.length;
        for (var _i = 0, rec_1 = rec; _i < rec_1.length; _i++) {
            var s = rec_1[_i];
            var n = s.substr(ll);
            if (n.includes('index.html'))
                continue;
            if (n.includes('index.pug'))
                continue;
            ret.push(n);
        }
        return ret;
    };
    Dirs.prototype.getShort = function () {
        var lst = this.getFolders();
        var ret = [];
        var ll = this.dir.length;
        logger.info(this.dir, ll);
        for (var _i = 0, lst_1 = lst; _i < lst_1.length; _i++) {
            var s = lst_1[_i];
            var n = s.substr(ll);
            ret.push(n);
        }
        return ret;
    };
    Dirs.prototype.getFolders = function () {
        logger.info(this.dir);
        var rec = FileHound.create()
            .paths(this.dir)
            .ext('pug')
            .findSync();
        var ret = [];
        for (var _i = 0, rec_2 = rec; _i < rec_2.length; _i++) {
            var val = rec_2[_i];
            val = Dirs.slash(val);
            var n = val.lastIndexOf('/');
            var s = val.substring(0, n);
            if (!fs.existsSync(s + '/dat.yaml'))
                continue;
            ret.push(s);
        }
        return Array.from(new Set(ret));
    };
    return Dirs;
}());
exports.Dirs = Dirs;
var Dat = (function () {
    function Dat(path__) {
        var path_ = Dirs.slash(path__);
        this._path = path_;
        var y;
        if (fs.existsSync(path_ + '/dat.yaml'))
            y = yaml.load(fs.readFileSync(path_ + '/dat.yaml'));
        if (!y)
            y = {};
        this.props = y;
        var keys = Object.keys(y);
        if (keys.includes('include'))
            this._addData();
    }
    Dat.prototype.write = function () {
        try {
            var y = yaml.dump(this.props, {
                skipInvalid: true,
                noRefs: true,
                noCompatMode: true,
                condenseFlow: true
            });
            var p = this._path + '/dat.yaml';
            logger.info(p);
            fs.writeFileSync(p, y);
        }
        catch (err) {
            logger.info(err);
        }
    };
    Dat.prototype.set = function (key, val) {
        this.props[key] = val;
    };
    Dat.prototype._addData = function () {
        var jn = this.props.include;
        var fn = this._path + '/' + jn;
        logger.info(fn);
        var jso = fs.readFileSync(fn);
        Object.assign(this.props, JSON.parse(jso.toString()));
    };
    Dat.prototype.getAll = function () {
        return this.props;
    };
    return Dat;
}());
exports.Dat = Dat;
module.exports = {
    Dat: Dat, Dirs: Dirs
};
