"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RPCBasicAuth_1 = require("../lib/RPCBasicAuth");
const Serv_1 = require("mbake/lib/Serv");
class AdminRoutes {
    routes() {
        const bodyParser = require("body-parser");
        const basicAuthRpc = new RPCBasicAuth_1.RPCBasicAuth();
        const adminApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:9080']);
        adminApp.use(bodyParser.json());
    }
    ;
}
exports.AdminRoutes = AdminRoutes;
module.exports = {
    AdminRoutes
};
