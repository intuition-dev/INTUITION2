"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const nocache = require('nocache');
const Base_1 = require("mbake/lib/Base");
const logger = require('tracer').console();
console.log(new Base_1.Ver().ver());
let config = yaml.load(fs.readFileSync(__dirname + '/admin.yaml'));
console.log(config);
const server = express();
server.use(cors());
let admin = new Base_1.AdminSrv(config);
server.use(basicAuth({ users: { 'admin': config.secret } }));
server.use(bodyParser({ limit: '10mb', extended: true }));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(nocache());
const mp = new Base_1.MetaPro2(config.mount);
const sc = new Base_1.Scrape();
const fo = new Base_1.FileOps(config.mount);
server.get('/api/last', function (req, res) {
    console.log(' last');
    res.setHeader('Content-Type', 'application/json');
    let ret = mp.getLastMsg();
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/bake', function (req, res) {
    console.log(' bake');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro2.folderProp];
    let ret = mp.bake(dir);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/tag', function (req, res) {
    console.log(' tag');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro2.folderProp];
    let ret = mp.tag(dir);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/items', function (req, res) {
    console.log(' items');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro2.folderProp];
    let ret = mp.getItems(dir);
    if (ret.code < 0)
        res.status(500).send(ret.cmd);
    else
        res.json(ret);
});
server.get('/api/item', function (req, res) {
    console.log(' item');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let path = qs['path'];
    if (path.indexOf('?') == 0)
        path = path.substring(1);
    if (path.indexOf('/') == 0)
        path = path.substring(1);
    let parts = path.split('/');
    if (parts.length == 0) {
        console.log('invalid path');
        return;
    }
    let item = parts[parts.length - 1];
    parts.pop();
    let listfolder = parts.join('/');
    console.log('listfolder' + listfolder);
    let ret = mp.getItem(listfolder, item);
    if (ret.code < 0)
        res.status(500).send(ret.cmd);
    else
        res.json(ret);
});
server.get('/api/idtoken', function (req, res) {
    console.log(' tag');
    res.setHeader('Content-Type', 'application/json');
    res.text(config.secret);
});
server.get('/api/users', function (req, res) {
    console.log(' users');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let folder = qs['folder'];
    mp.getUsers(req, res, folder);
});
server.get('/api/user', function (req, res) {
    console.log(' user');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let uid = qs['uid'];
    let ret = mp.getUser('team', uid);
    if (ret.code < 0)
        res.status(500).send(ret.cmd);
    else
        res.json(ret);
});
server.get('/api/itemize', function (req, res) {
    console.log(' itemize');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro2.folderProp];
    let ret = mp.itemize(dir);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/scrape', function (req, res) {
    console.log(' scrape');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let url = qs['url'];
    let b = new Buffer(url, 'base64');
    url = b.toString();
    sc.s(url)
        .then(function (resp) {
        console.log(resp);
        let ret = new Base_1.RetMsg('sc', 1, resp);
        res.json(ret);
    });
});
server.post('/api/newLinkBlog', function (req, res) {
    console.log(' newLinkBlog');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let url = qs['url'];
    let b = new Buffer(url, 'base64');
    url = b.toString();
    let src = qs['src'];
    let dest = qs['dest'];
    let comment = req.body.comment;
    let tags = req.body.tags;
    try {
        sc.s(url)
            .then(function (resp) {
            logger.trace(resp);
            fo.clone(src, dest);
            const p = config.mount + dest;
            logger.trace(p);
            let d = new Base_1.Dat(p);
            let imgUrl = resp['image'];
            d.set('tags', tags);
            d.set('title', resp['title']);
            d.set('image', imgUrl);
            d.set('content_text', comment);
            d.set('comment', resp['content_text']);
            d.set('external_url', url);
            d.set('date_published', (new Date()).toISOString());
            d.set('publish', true);
            d.write();
            Base_1.Scrape.getImageSize('https://i.imgur.com/YdwRA30.jpg').then(function (idata) {
                d.set('img_w', idata['width']);
                d.set('img_h', idata['height']);
                d.set('img_typ', idata['type']);
                d.set('img_sz', idata['length']);
                d.write();
            });
            let ret = new Base_1.RetMsg('sc', 1, resp);
            res.json(ret);
            logger.trace(comment);
            let md = dest + '/comment.md';
            logger.trace(md);
            fo.write(md, comment);
            console.log('II scrape done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        });
    }
    catch (err) {
        console.log('// ERR //////////////////////////////////////////////////////');
        console.log(err);
    }
});
server.post('/api/item', function (req, res) {
    console.log(' add or update item');
    res.setHeader('Content-Type', 'application/json');
    let body = req.body;
    let action = body.action;
    let folder = body.folder;
    let title = body.title;
    let comment = body.summary;
    let content = body.content;
    let f1 = body.f1;
    let fx = body.fx;
    let f1name = body.f1name;
    logger.trace('f1name' + f1name);
    let isNew = ('insert' === action);
    logger.trace("isNew" + isNew);
    let dest = '/' + folder;
    if (isNew)
        dest = '/' + folder + '/' + slugify(title.toLowerCase());
    const p = config.mount + dest;
    logger.trace(p);
    try {
        let p0 = p;
        if (isNew) {
            let i = 1;
            while (fs.existsSync(p0)) {
                i++;
                p0 = p + i;
            }
            if (i > 1)
                dest = dest + i;
            fo.clone('/blog/template', dest);
        }
        let d = new Base_1.Dat(p0);
        d.set('title', title);
        d.set('comment', comment);
        d.set('tags', body.tags);
        d.set('external_url', 'NA');
        d.set('date_published', body.date_published);
        d.set('publish', true);
        d.write();
        let oldmedia = [], newmedia = [];
        if (!isNew) {
            oldmedia = fo.getMediaFilenames(folder);
            console.log('oldmedia' + oldmedia);
        }
        if (f1name) {
            newmedia.push(f1name);
            if (f1 && f1.indexOf('data:') == 0) {
                var buffer = Buffer.from(f1.split(",")[1], 'base64');
                let f1path = dest + '/' + f1name;
                fo.write(f1path, buffer);
                d.set('image', f1name);
                d.write();
            }
        }
        else {
            d.set('image', '');
            d.write();
        }
        if (fx && fx != '[]') {
            let mediaitems = JSON.parse(fx);
            let j, len = mediaitems.length;
            for (j = 0; j < len; j++) {
                let obj = mediaitems[j];
                let f1path = dest + '/' + obj.filename;
                newmedia.push(obj.filename);
                if (obj.src.indexOf('data:') == 0) {
                    var buffer = Buffer.from(obj.src.split(",")[1], 'base64');
                    fo.write(f1path, buffer);
                }
            }
        }
        console.log('Writing media done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        if (!isNew) {
            let k = 0, klen = oldmedia.length;
            for (k; k < klen; k++) {
                if (newmedia.indexOf(oldmedia[k]) == -1) {
                    fo.removeFile(dest + '/' + oldmedia[k]);
                }
            }
        }
        let md = dest + '/content.md';
        logger.trace(md);
        fo.write(md, content);
        console.log('Writing content done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        let rex = mp.bake(dest);
        console.log('Baking done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        let ret = mp.itemizeOnly(folder);
        if (ret.code < 0)
            res.status(500).send(ret);
        else
            res.json(ret);
        console.log('Itemize done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
    }
    catch (err) {
        console.log('// ERR //////////////////////////////////////////////////////');
        console.log(err);
    }
});
server.get('/api/removeitem', function (req, res) {
    console.log(' removeitem');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let listfolder = qs['listfolder'];
    let item = qs['item'];
    fo.remove('/' + listfolder + '/' + item);
    mp.itemizeOnly(listfolder);
    let ret = mp.getItems(listfolder);
    if (ret.code < 0)
        res.status(500).send(ret.cmd);
    else
        res.json(ret);
});
server.post('/api/user', function (req, res) {
    console.log(' add or update user');
    res.setHeader('Content-Type', 'application/json');
    let body = req.body;
    let action = body.action;
    let folder = body.folder;
    let currentRole = body.role;
    let f1 = body.f1;
    let f1name = body.f1name;
    logger.trace('f1name' + f1name);
    let isNew = ('insert' === action);
    logger.trace("isNew" + isNew);
    let dest = '/team/' + folder;
    console.log('new user dest' + dest);
    const p = config.mount + dest;
    logger.trace('creating item at' + p);
    try {
        if (isNew)
            fo.clone('/team/template', dest);
        let d = new Base_1.Dat(p);
        d.set('currentRole', currentRole);
        d.set('publish', true);
        d.write();
        let oldmedia = [], newmedia = [];
        if (!isNew) {
            oldmedia = fo.getMediaFilenames(folder);
            console.log('oldmedia' + oldmedia);
        }
        if (f1name) {
            newmedia.push(f1name);
            if (f1 && f1.indexOf('data:') == 0) {
                var buffer = Buffer.from(f1.split(",")[1], 'base64');
                let f1path = dest + '/' + f1name;
                fo.write(f1path, buffer);
                d.set('image', f1name);
                d.write();
            }
        }
        else {
            d.set('image', '');
            d.write();
        }
        if (!isNew) {
            let k = 0, klen = oldmedia.length;
            for (k; k < klen; k++) {
                if (newmedia.indexOf(oldmedia[k]) == -1) {
                    fo.removeFile(dest + '/' + oldmedia[k]);
                }
            }
        }
        let ret = mp.itemizeOnly('team');
        if (ret.code < 0)
            res.status(500).send(ret);
        else
            res.json(ret);
        console.log('Itemize done IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
    }
    catch (err) {
        console.log('// ERR //////////////////////////////////////////////////////');
        console.log(err);
    }
});
server.get('/api/removeuser', function (req, res) {
    console.log(' removeuser');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let listfolder = qs['listfolder'];
    let item = qs['item'];
    fo.remove('/' + listfolder + '/' + item);
    mp.itemizeOnly(listfolder);
    mp.deleteAuthUser(item)
        .then(function () {
        mp.getUsers(req, res, listfolder);
    });
});
server.get('/api/clone', function (req, res) {
    console.log(' itemize');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let src = qs['src'];
    let dest = qs['dest'];
    let ret = fo.clone(src, dest);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
var listener = server.listen(config.services_port, function () {
    var host = listener.address().address;
    var port = listener.address().port;
    console.log("admin services port at http://%s:%s", host, port);
});
let app = new Base_1.MDevSrv2(config['mount'], config['mount_port'], true);
let w = new Base_1.Watch2(mp, config['mount']);
setTimeout(function () {
    console.log('Startup build:');
    mp.tagRoot();
    startW();
}, 4000);
function startW() {
    if (!config.admin_watch)
        return;
    setTimeout(function () {
        w.start(true);
        console.log('// READY //////////////////////////////////////////////////////');
    }, 3000);
}
