"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./lib/editor");
const admin_1 = require("./lib/admin");
const ADB_1 = require("./lib/ADB");
const Email_1 = require("./lib/Email");
const adbDB = new ADB_1.ADB();
const bodyParser = require("body-parser");
const mainApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
const appPORT = '9081';
const fs = require('fs');
const pathToDb = 'ADB.sqlite';
mainApp.use(bodyParser.json());
mainApp.use(bodyParser.text());
mainApp.use(bodyParser.urlencoded({ extended: true }));
const emailJs = new Email_1.Email();
try {
    if (fs.existsSync(pathToDb)) {
        adbDB.createNewADBwSchema('ADB.sqlite');
        const editorRoutes = new editor_1.EditorRoutes();
        mainApp.use('/api/editors', editorRoutes.routes(adbDB));
        mainApp.use('/editors', Serv_1.ExpressRPC.serveStatic('www'));
        const adminRoutes = new admin_1.AdminRoutes();
        mainApp.use('/api/admin', adminRoutes.routes(adbDB));
        mainApp.use('/admin', Serv_1.ExpressRPC.serveStatic('wwwAdmin'));
    }
    else {
        fs.open('ADB.sqlite', 'w', runSetup);
    }
}
catch (err) {
}
function runSetup() {
    mainApp.use('/setup', Serv_1.ExpressRPC.serveStatic('setup'));
    adbDB.createNewADBwSchema('ADB.sqlite');
    const editorRoutes = new editor_1.EditorRoutes();
    mainApp.use('/api/editors', editorRoutes.routes(adbDB));
    mainApp.use('/editors/', Serv_1.ExpressRPC.serveStatic('www'));
    const adminRoutes = new admin_1.AdminRoutes();
    mainApp.use('/api/admin', adminRoutes.routes(adbDB));
    mainApp.use('/admin', Serv_1.ExpressRPC.serveStatic('wwwAdmin'));
}
mainApp.post("/setup", async (req, res) => {
    const method = req.fields.method;
    let params = JSON.parse(req.fields.params);
    let email = params.email;
    let password = params.password;
    let emailjsService_id = params.emailjsService_id;
    let emailjsTemplate_id = params.emailjsTemplate_id;
    let emailjsUser_id = params.emailjsUser_id;
    let pathToSite = params.pathToSite;
    let resp = {};
    if ('setup' == method) {
        resp.result = {};
        try {
            console.info('setup called ...');
            adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite);
            console.info('db cretated  ...');
            let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
            emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
            resp['result'] = 'OK';
            return res.json(resp);
        }
        catch (err) {
        }
    }
    else {
        return res.json(resp);
    }
});
mainApp.listen(appPORT, () => {
    console.log(`mainApp listening on port ${appPORT}!`);
    console.log(`======================================================`);
    console.log(`App is running at http://localhost:${appPORT}/editors/`);
    console.log(`Admin is running at http://localhost:${appPORT}/admin/`);
    console.log(`======================================================`);
});
