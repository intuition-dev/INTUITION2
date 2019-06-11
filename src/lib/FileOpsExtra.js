"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1 = require("./Base");
var FileOpsBase_1 = require("./FileOpsBase");
var FileHound = require("filehound");
var logger = require('tracer').console();
var fs = require("fs-extra");
var csv2JsonV2 = require("csvtojson");
var AdmZip = require("adm-zip");
var download = require("download");
var yaml = require("js-yaml");
var DownloadFrag = (function () {
    function DownloadFrag(dir, ops) {
        console.log('Extracting to', dir);
        if (!ops) {
            new Download('headFrag', dir).auto();
        }
        if (ops) {
            new Download('opsPug', dir).auto();
            new Download('opsJs', dir).auto();
        }
    }
    return DownloadFrag;
}());
exports.DownloadFrag = DownloadFrag;
var VersionNag = (function () {
    function VersionNag() {
    }
    VersionNag.isCurrent = function () {
        var down = new Download('mbake', null);
        return down.checkVer();
    };
    return VersionNag;
}());
exports.VersionNag = VersionNag;
var Download = (function () {
    function Download(key_, targetDir_) {
        this.key = key_;
        this.targetDir = targetDir_;
    }
    Download.prototype.autoZ = function () {
        var THIZ = this;
        this.getVal().then(function (url) {
            logger.trace(url);
            var fn = THIZ.getFn(url);
            logger.trace(fn);
            THIZ.down(url, fn).then(function () {
                THIZ.unzip(fn);
            });
        });
    };
    Download.prototype.auto = function () {
        var THIZ = this;
        this.getVal().then(function (url) {
            var fn = THIZ.getFn(url);
            THIZ.down(url, fn);
        });
    };
    Download.prototype.checkVer = function () {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.getVal().then(function (ver) {
                logger.trace(ver);
                if (ver == Base_1.Ver.ver())
                    resolve(true);
                else
                    resolve(false);
            });
        });
    };
    Download.prototype.getVal = function () {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            download(Download.truth).then(function (data) {
                var dic = yaml.load(data);
                logger.trace(THIZ.key, dic);
                resolve(dic[THIZ.key]);
            });
        });
    };
    Download.prototype.getFn = function (url) {
        var pos = url.lastIndexOf('/');
        return url.substring(pos);
    };
    Download.prototype.down = function (url, fn) {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            download(url).then(function (data) {
                fs.writeFileSync(THIZ.targetDir + '/' + fn, data);
                resolve('OK');
            });
        });
    };
    Download.prototype.unzip = function (fn) {
        var zip = new AdmZip(this.targetDir + '/' + fn);
        zip.extractAllTo(this.targetDir, true);
        fs.remove(this.targetDir + '/' + fn);
    };
    Download.truth = 'https://MetaBake.github.io/mBakeCli/versions.yaml';
    return Download;
}());
exports.Download = Download;
var Static = (function () {
    function Static(jsonUrl, partentFodler, templatePg) {
    }
    return Static;
}());
exports.Static = Static;
var YamlConfig = (function () {
    function YamlConfig(fn) {
        var cfg = yaml.load(fs.readFileSync(fn));
        console.info(cfg);
        return cfg;
    }
    return YamlConfig;
}());
exports.YamlConfig = YamlConfig;
var CSV2Json = (function () {
    function CSV2Json(dir_) {
        if (!dir_ || dir_.length < 1) {
            console.info('no path arg passed');
            return;
        }
        this.dir = FileOpsBase_1.Dirs.slash(dir_);
    }
    CSV2Json.prototype.convert = function () {
        return new Promise(function (resolve, reject) {
            var fn = this.dir + '/list.csv';
            if (!fs.existsSync(fn)) {
                console.info('not found');
                reject('not found');
            }
            var thiz = this;
            logger.info('1');
            csv2JsonV2({ noheader: true }).fromFile(fn)
                .then(function (jsonO) {
                logger.info(jsonO);
                var fj = thiz.dir + '/list.json';
                fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3));
                resolve('OK');
            });
        });
    };
    return CSV2Json;
}());
exports.CSV2Json = CSV2Json;
var FileOps = (function () {
    function FileOps(root_) {
        this.root = FileOpsBase_1.Dirs.slash(root_);
    }
    FileOps.prototype.count = function (fileAndExt) {
        var files = FileHound.create()
            .paths(this.root)
            .depth(0)
            .match(fileAndExt + '*')
            .findSync();
        return files.length;
    };
    FileOps.prototype.clone = function (src, dest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            logger.info('copy?');
            fs.copySync(_this.root + src, _this.root + dest);
            var p = _this.root + dest;
            logger.info(p);
            var d = new FileOpsBase_1.Dat(p);
            d.write();
            logger.info('copy!');
            resolve('OK');
        });
    };
    FileOps.prototype.write = function (destFile, txt) {
        logger.info(this.root + destFile);
        fs.writeFileSync(this.root + destFile, txt);
    };
    FileOps.prototype.read = function (file) {
        return fs.readFileSync(this.root + file).toString();
    };
    FileOps.prototype.remove = function (path) {
        var dir_path = this.root + path;
        logger.info('remove:' + dir_path);
        if (fs.existsSync(dir_path)) {
            fs.readdirSync(dir_path).forEach(function (entry) {
                fs.unlinkSync(dir_path + '/' + entry);
            });
            fs.rmdirSync(dir_path);
        }
    };
    FileOps.prototype.removeFile = function (path) {
        var file_path = this.root + path;
        fs.unlinkSync(file_path);
    };
    return FileOps;
}());
exports.FileOps = FileOps;
module.exports = {
    FileOps: FileOps, CSV2Json: CSV2Json, DownloadFrag: DownloadFrag, YamlConfig: YamlConfig, Download: Download, Static: Static, VersionNag: VersionNag
};
