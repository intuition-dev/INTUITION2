"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileOpsBase_1 = require("./FileOpsBase");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "file ops x" });
const fs = require("fs-extra");
const AdmZip = require("adm-zip");
const download = require("download");
const yaml = require("js-yaml");
class DownloadC {
    constructor(key_, targetDir_) {
        this.key = key_;
        this.targetDir = targetDir_;
    }
    autoUZ() {
        const THIZ = this;
        this.getVal().then(function (url) {
            log.info(url);
            const fn = THIZ.getFn(url);
            log.info(fn);
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
    checkVer(lver) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.getVal().then(function (ver) {
                if (ver == lver)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }
    getVal() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(DownloadC.truth).then(data => {
                let dic = yaml.load(data);
                resolve(dic[THIZ.key]);
            }).catch(err => {
                log.info('err: where is the vfile?', err, DownloadC.truth);
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
                log.info('downloaded');
                resolve('OK');
            }).catch(err => {
                log.info('err: where is the file?', err, url);
            });
        });
    }
    unzip(fn) {
        const zfn = this.targetDir + fn;
        log.info(zfn);
        const zip = new AdmZip(zfn);
        zip.extractAllTo(this.targetDir, true);
        fs.remove(this.targetDir + '/' + fn);
    }
}
exports.DownloadC = DownloadC;
DownloadC.truth = 'https://Intuition-DEV.github.io/mbCLI/versions.yaml';
class YamlConfig {
    constructor(fn) {
        let cfg = yaml.load(fs.readFileSync(fn));
        log.info(cfg);
        return cfg;
    }
}
exports.YamlConfig = YamlConfig;
class DownloadFrag {
    constructor(dir, ops) {
        log.info('Extracting to', dir);
        if (!ops) {
            new DownloadC('headFrag', dir).auto();
            new DownloadC('Bind', dir).auto();
        }
        if (ops) {
            new DownloadC('opsPug', dir).auto();
            new DownloadC('opsJs', dir).auto();
        }
    }
}
exports.DownloadFrag = DownloadFrag;
class VersionNag {
    static isCurrent(prod, ver) {
        const down = new DownloadC(prod, null);
        return down.checkVer(ver);
    }
}
exports.VersionNag = VersionNag;
class FileMethods {
    getDirs(mountPath) {
        let dirs = new FileOpsBase_1.Dirs(mountPath);
        let dirsToIgnore = ['.', '..'];
        return dirs.getShort()
            .map(el => el.replace(/^\/+/g, ''))
            .filter(el => !dirsToIgnore.includes(el));
    }
    getFiles(mountPath, item) {
        let dirs = new FileOpsBase_1.Dirs(mountPath);
        let result = dirs.getInDir(item);
        if (item === '/') {
            return result.filter(file => file.indexOf('/') === -1 && !fs.lstatSync(mountPath + '/' + file).isDirectory());
        }
        else {
            return result;
        }
    }
}
exports.FileMethods = FileMethods;
module.exports = {
    DownloadFrag, YamlConfig, DownloadC, VersionNag, FileMethods
};
