"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const Base_1 = require("nbake/lib/Base");
const logger = require('tracer').console();
let config = yaml.load(fs.readFileSync(__dirname + '/admin.yaml'));
console.log(config);
const server = express();
server.use(cors());
server.use(basicAuth({
    users: { 'admin': config.secret }
}));
const ms = new Base_1.MetaPro(config);
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
    let dir = qs[Base_1.MetaPro.folderProp];
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
    let dir = qs[Base_1.MetaPro.folderProp];
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
let app = new Base_1.MDevSrv(config);
let admin = new Base_1.AdminSrv(config);
let w = new Base_1.Watch(ms, config);
setTimeout(function () {
    console.log('Startup build:');
    ms.tagRoot();
    startW();
}, 6000);
function startW() {
    setTimeout(function () {
        w.start();
    }, 8000);
}
