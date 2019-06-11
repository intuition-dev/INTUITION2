"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const FileOpsBase_1 = require("./FileOpsBase");
const logger = require('tracer').console();
const fs = require("fs-extra");
const csv2JsonV2 = require("csvtojson");
const AdmZip = require("adm-zip");
const download = require("download");
const yaml = require("js-yaml");
class DownloadFrag {
    constructor(dir, ops) {
        console.log('Extracting to', dir);
        if (!ops) {
            new Download('headFrag', dir).auto();
        }
        if (ops) {
            new Download('opsPug', dir).auto();
            new Download('opsJs', dir).auto();
        }
    }
}
exports.DownloadFrag = DownloadFrag;
class VersionNag {
    static isCurrent() {
        const down = new Download('mbake', null);
        return down.checkVer();
    }
}
exports.VersionNag = VersionNag;
class Download {
    constructor(key_, targetDir_) {
        this.key = key_;
        this.targetDir = targetDir_;
    }
    autoZ() {
        const THIZ = this;
        this.getVal().then(function (url) {
            logger.trace(url);
            const fn = THIZ.getFn(url);
            logger.trace(fn);
            THIZ.down(url, fn).then(function () {
                THIZ.unzip(fn);
            });
        });
    }
    auto() {
        const THIZ = this;
        this.getVal().then(function (url) {
            const fn = THIZ.getFn(url);
            THIZ.down(url, fn);
        });
    }
    checkVer() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.getVal().then(function (ver) {
                logger.trace(ver);
                if (ver == Base_1.Ver.ver())
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }
    getVal() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(Download.truth).then(data => {
                let dic = yaml.load(data);
                logger.trace(THIZ.key, dic);
                resolve(dic[THIZ.key]);
            });
        });
    }
    getFn(url) {
        const pos = url.lastIndexOf('/');
        return url.substring(pos);
    }
    down(url, fn) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(url).then(data => {
                fs.writeFileSync(THIZ.targetDir + '/' + fn, data);
                resolve('OK');
            });
        });
    }
    unzip(fn) {
        let zip = new AdmZip(this.targetDir + '/' + fn);
        zip.extractAllTo(this.targetDir, true);
        fs.remove(this.targetDir + '/' + fn);
    }
}
Download.truth = 'https://MetaBake.github.io/mBakeCli/versions.yaml';
exports.Download = Download;
class Static {
    constructor(jsonUrl, partentFodler, templatePg) {
    }
}
exports.Static = Static;
class YamlConfig {
    constructor(fn) {
        let cfg = yaml.load(fs.readFileSync(fn));
        console.info(cfg);
        return cfg;
    }
}
exports.YamlConfig = YamlConfig;
class CSV2Json {
    constructor(dir_) {
        if (!dir_ || dir_.length < 1) {
            console.info('no path arg passed');
            return;
        }
        this.dir = FileOpsBase_1.Dirs.slash(dir_);
    }
    convert() {
        return new Promise(function (resolve, reject) {
            let fn = this.dir + '/list.csv';
            if (!fs.existsSync(fn)) {
                console.info('not found');
                reject('not found');
            }
            let thiz = this;
            logger.info('1');
            csv2JsonV2({ noheader: true }).fromFile(fn)
                .then(function (jsonO) {
                logger.info(jsonO);
                let fj = thiz.dir + '/list.json';
                fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3));
                resolve('OK');
            });
        });
    }
}
exports.CSV2Json = CSV2Json;
module.exports = {
    CSV2Json, DownloadFrag, YamlConfig, Download, Static, VersionNag
};
