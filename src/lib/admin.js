"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
class AdminRoutes {
    routes(adbDB) {
        const bodyParser = require("body-parser");
        const adminApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
        adminApp.use(bodyParser.json());
        adminApp.post('/checkAdmin', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let password = params.admin_pass;
            let resp = {};
            if ('check-admin' == method) {
                resp.result = {};
                try {
                    var pass = adbDB.getAdmin(email, password);
                    if (pass) {
                        resp['pass'] = true;
                        return res.json(resp);
                    }
                    else {
                        resp['pass'] = false;
                        return res.json(resp);
                    }
                }
                catch (err) {
                }
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post("/editors", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            if ('get' == method) {
                resp.result = 'editors herer';
                return res.json(resp);
            }
            else {
                return res.json(resp);
            }
        });
        return adminApp;
    }
    ;
}
exports.AdminRoutes = AdminRoutes;
module.exports = {
    AdminRoutes
};
