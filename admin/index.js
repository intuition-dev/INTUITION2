"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const chokidar = require('chokidar');
const reload = require('reload');
const Base_1 = require("nBake/lib/Base");
const logger = require('tracer').console();
let config = yaml.load(fs.readFileSync(__dirname + '/admin.yaml'));
console.log(config);
const server = express();
server.use(cors());
server.use(basicAuth({
    users: { 'admin': config.secret }
}));
class MDevSrv {
    constructor(config) {
        let dir = config['mount'];
        let port = config['mount_port'];
        let app = express();
        logger.trace(dir, port);
        app.set('app port', port);
        MDevSrv.reloadServer = reload(app, { verbose: true, port: 9856 });
        app.set('views', dir);
        app.use(express.static(dir));
        app.listen(port, function () {
            logger.trace('dev app' + port);
        });
    }
}
exports.MDevSrv = MDevSrv;
class AdminSrv {
    constructor(config) {
        let dir = config['admin_www'];
        let port = config['admin_port'];
        let app = express();
        logger.trace(dir, port);
        app.set('admin port', port);
        AdminSrv.reloadServer = reload(app, { port: 9857 });
        app.set('views', dir);
        app.use(express.static(dir));
        app.listen(port, function () {
            logger.trace('admin app' + port);
        });
    }
}
exports.AdminSrv = AdminSrv;
class Watch {
    constructor(mp_, config) {
        this.mp = mp_;
        this.root = config['mount'];
    }
    start() {
        console.log('watch only works on linux on ssh watched drives - that are likely S3 mounts');
        console.log(this.root);
        this.watcher = chokidar.watch(this.root, {
            ignored: '*.html',
            ignoreInitial: true,
            cwd: this.root,
            usePolling: true,
            binaryInterval: 100000,
            interval: 320,
            alwaysStat: true
        });
        let thiz = this;
        this.watcher.on('add', function (path) {
            thiz.auto(path);
            thiz.auto(path);
        });
        this.watcher.on('change', function (path) {
            thiz.auto(path);
        });
    }
    refreshBro() {
        setTimeout(function () {
            MDevSrv.reloadServer.reload();
            AdminSrv.reloadServer.reload();
        }, 320);
    }
    auto(path) {
        console.log('w', path);
        let p = path.lastIndexOf('/');
        let folder = '';
        let fn = path;
        if (p > 0) {
            folder = path.substring(0, p);
            fn = path.substr(p + 1);
        }
        console.log(folder, fn);
        try {
            const fn = path;
            this.mp.autoBake(folder, fn);
            this.refreshBro();
        }
        catch (err) {
            logger.warn(err);
        }
    }
}
exports.Watch = Watch;
class MetaPro {
    constructor(config) {
        this.m = new Base_1.Meta();
        this.mount = config.mount;
    }
    setLast(m) {
        this._lastMsg = new Base_1.RetMsg(m._cmd, m.code, m.msg);
    }
    getLastMsg() {
        let m = this._lastMsg;
        return new Base_1.RetMsg(m._cmd, m.code, m.msg);
    }
    bake(dir) {
        let folder = this.mount + dir;
        logger.trace(folder);
        let msg = this.m.bake(folder);
        this.setLast(msg);
        return msg;
    }
    tagRoot() {
        return this.tag('/');
    }
    tag(dir) {
        let folder = this.mount + dir;
        logger.trace(folder);
        let msg = this.m.tag(folder);
        this.setLast(msg);
        return msg;
    }
    itemize() {
        let msg = this.m.itemize(this.mount);
        this.setLast(msg);
        return msg;
    }
    autoBake(folder, file) {
        const full = this.mount + folder + '/' + file;
        logger.trace(full);
        const ext = file.split('.').pop();
        if (ext == 'md')
            return this.bake(folder);
        if (ext == 'pug') {
            if (file.indexOf('-tag') >= 0)
                return this.tag(folder);
            else
                return this.bake(folder);
        }
        if (ext == 'yaml')
            return this.m.itemizeNBake(folder);
        let m = new Base_1.RetMsg(folder + '-' + file, -1, 'nothing to bake');
        this.setLast(m);
        return m;
    }
}
MetaPro.folderProp = 'folder';
MetaPro.srcProp = 'src';
MetaPro.destProp = 'dest';
exports.MetaPro = MetaPro;
const ms = new MetaPro(config);
server.get('/api/last', function (req, res) {
    console.log(' last');
    res.setHeader('Content-Type', 'application/json');
    let ret = ms.getLastMsg();
    if (ret.code < 0)
        res.status(500).send(ret.msg);
    else
        res.json(ret.msg);
});
server.get('/api/bake', function (req, res) {
    console.log(' bake');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[MetaPro.folderProp];
    let ret = ms.bake(dir);
    if (ret.code < 0)
        res.status(500).send(ret.msg);
    else
        res.json(ret.msg);
});
server.get('/api/tag', function (req, res) {
    console.log(' tag');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[MetaPro.folderProp];
    let ret = ms.tag(dir);
    if (ret.code < 0)
        res.status(500).send(ret.msg);
    else
        res.json(ret.msg);
});
server.get('/api/itemize', function (req, res) {
    console.log(' itemize');
    res.setHeader('Content-Type', 'application/json');
    let ret = ms.itemize();
    if (ret.code < 0)
        res.status(500).send(ret.msg);
    else
        res.json(ret.msg);
});
var listener = server.listen(config.services_port, function () {
    var host = listener.address().address;
    var port = listener.address().port;
    console.log("admin services port at http://%s:%s", host, port);
});
let app = new MDevSrv(config);
let admin = new AdminSrv(config);
let w = new Watch(ms, config);
setTimeout(function () {
    console.log('First build:');
    ms.tagRoot();
    startW();
}, 3000);
function startW() {
    setTimeout(function () {
        w.start();
    }, 5000);
}
