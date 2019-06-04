"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RPCBasicAuth_1 = require("../lib/RPCBasicAuth");
const Serv_1 = require("mbake/lib/Serv");
class AdminRoutes {
    routes() {
        const bodyParser = require("body-parser");
        const yaml = require('js-yaml');
        const fs = require('fs');
        let config = yaml.load(fs.readFileSync(__dirname + '/../config.yaml'));
        const basicAuthRpc = new RPCBasicAuth_1.RPCBasicAuth();
        const adminApp = Serv_1.ExpressRPC.makeInstance(config.corsUrlAdmin);
        adminApp.use(bodyParser.json());
        adminApp.use(basicAuthRpc.auth('admin', '123456'));
        return adminApp;
    }
    ;
}
exports.AdminRoutes = AdminRoutes;
module.exports = {
    AdminRoutes
};
