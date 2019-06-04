"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
class AdminRoutes {
    routes(adbDB) {
        const bodyParser = require("body-parser");
        const adminApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
        adminApp.use(bodyParser.json());
        adminApp.use((request, response, next) => {
            const params = JSON.parse(request.fields.params);
            const resp = {};
            let email = params.admin_email;
            let password = params.admin_pass;
            try {
                var pass = adbDB.validateEmail(email);
                if (pass) {
                    next();
                }
            }
            catch (err) {
            }
        });
        adminApp.post('/checkAdmin', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let password = params.admin_pass;
            let resp = {};
            if ('check-admin' == method) {
                resp.result = {};
                try {
                    var pass = adbDB.validateEmail(email, password);
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
                adbDB.getEditors()
                    .then(function (editors) {
                    let data = [];
                    editors.map(function (editor) {
                        data.push({
                            id: editor.id,
                            email: editor.email,
                            name: editor.name
                        });
                    });
                    resp.result = data;
                    return res.json(resp);
                });
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
