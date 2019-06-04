"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
class AdminRoutes {
    routes(adbDB) {
        const bodyParser = require("body-parser");
        const adminApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
        adminApp.use(bodyParser.json());
        adminApp.use((request, response, next) => {
            if (request.path === '/resetPassword') {
                next();
            }
            const params = JSON.parse(request.fields.params);
            const resp = {};
            let email = params.admin_email;
            console.info("--email:", email);
            let password = params.admin_pass;
            console.info("--password:", password);
            return adbDB.validateEmail(email, password)
                .then(function (pass) {
                resp.result = {};
                console.info("--pass:", pass);
                if (pass) {
                    console.info("--passsdfsdfsd:", pass);
                    return next();
                }
                else {
                    resp.errorLevel = -1;
                    resp.result = false;
                    console.log('noway', resp);
                    return response.json(resp);
                }
            }).catch(function (error) {
                console.info('=========== token expired catch logout ================');
                console.info('error', error);
                resp.errorLevel = -1;
                resp.errorMessage = error;
                resp.result = false;
                console.log('noway', resp);
                return response.json(resp);
            });
        });
        adminApp.post('/checkAdmin', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let password = params.admin_pass;
            let resp = {};
            if ('check-admin' == method) {
                resp.result = {};
                console.info("--hey:sfsdfsd");
                try {
                    resp.result = true;
                    console.info("--resp:", resp);
                    return res.json(resp);
                }
                catch (err) {
                }
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post('/resetPassword', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let resp = {};
            if ('code' == method) {
                console.info("Reset password code");
                resp.result = {};
                try {
                    var code = adbDB.sendVcode(email);
                    if (code) {
                        resp['code'] = true;
                        return res.json(resp);
                    }
                    else {
                        resp['code'] = false;
                        return res.json(resp);
                    }
                }
                catch (err) {
                }
            }
            else if ('reset-password' == method) {
                console.info("Reset password reset-password");
                resp.result = {};
                try {
                    let result = adbDB.resetPassword(email, params.code, params.password);
                    if (result) {
                        resp['reset'] = true;
                        return res.json(resp);
                    }
                    else {
                        resp['reset'] = false;
                        return res.json(resp);
                    }
                }
                catch (err) {
                    res.status(400);
                    resp.result = { error: 'Unable to reset passsord' };
                    res.json(resp);
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
                    console.info("--resp:", resp);
                    return res.json(resp);
                });
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post("/editors-add", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('post' == method) {
                let email = params.email;
                let name = params.name;
                let password = params.password;
                if (typeof email !== 'undefined' &&
                    typeof name !== 'undefined' &&
                    typeof password !== 'undefined') {
                    adbDB.addEditor(email, name, password)
                        .then(function (editorId) {
                        let response = {
                            id: editorId
                        };
                        resp.result = response;
                        return res.json(resp);
                    });
                }
                else {
                    res.status(400);
                    resp.result = { error: 'parameters missing' };
                    res.json(resp);
                }
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
