"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server = require('express')();
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const Base_1 = require("nBake/lib/Base");
const logger = require('tracer').console();
server.use(cors());
server.use(basicAuth({
    users: { 'admin': '123' }
}));
class BakeSrv {
    constructor(config) {
        this.m = new Base_1.Meta();
        this.mount = config.mount;
    }
    bake(dir) {
        let folder = this.mount + dir;
        logger.trace(folder);
        this.m.bake(folder);
    }
}
exports.BakeSrv = BakeSrv;
let config = new Object();
config['mount'] = '/Users/uptim/Documents/GitHub/B-M-SPA/blog';
const bs = new BakeSrv(config);
bs.bake('/');
server.get('/listUsers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ a: 1 });
});
server.get('/api/bake', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ a: 1 });
});
var listener = server.listen(9090, function () {
    var host = listener.address().address;
    var port = listener.address().port;
    console.log("Server listening at http://%s:%s", host, port);
});
