"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server = require('express')();
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const Base_1 = require("nBake/lib/Base");
const logger = require('tracer').console();
let config = yaml.load(fs.readFileSync(__dirname + '/admin.yaml'));
console.log(config);
server.use(cors());
server.use(basicAuth({
    users: { 'admin': config.secret }
}));
class BakeSrv {
    constructor(config) {
        this.m = new Base_1.Meta();
        this.mount = config.mount;
    }
    bake(dir) {
        let folder = this.mount + dir;
        logger.trace(folder);
        let msg = this.m.bake(folder);
        return msg;
    }
}
BakeSrv.folderProp = 'folder';
BakeSrv.srcProp = 'src';
BakeSrv.destProp = 'dest';
exports.BakeSrv = BakeSrv;
const bs = new BakeSrv(config);
server.get('/api/bake', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[BakeSrv.folderProp];
    let ret = bs.bake(dir);
    if (ret.code < 0)
        res.status(500).send(ret.msg);
    else
        res.json(ret.msg);
});
var listener = server.listen(config.mount_port, function () {
    var host = listener.address().address;
    var port = listener.address().port;
    console.log("Server listening at http://%s:%s", host, port);
});
