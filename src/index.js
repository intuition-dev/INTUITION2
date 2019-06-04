"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./lib/editor");
const admin_1 = require("./lib/admin");
const ADB_1 = require("./lib/ADB");
const adbDB = new ADB_1.ADB();
const bodyParser = require("body-parser");
const mainAppG = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
const appPORT = '9081';
const fs = require('fs');
const pathToDb = 'ADB.sqlite';
mainAppG.use(bodyParser.json());
mainAppG.use(bodyParser.text());
mainAppG.use(bodyParser.urlencoded({ extended: true }));
try {
    if (fs.existsSync(pathToDb)) {
        adbDB.createNewADBwSchema('ADB.sqlite');
        const editorRoutes = new editor_1.EditorRoutes();
        mainAppG.use('/api/editors', editorRoutes.routes(adbDB));
        mainAppG.use('/editors', Serv_1.ExpressRPC.serveStatic('www'));
        const adminRoutes = new admin_1.AdminRoutes();
        mainAppG.use('/api/admin', adminRoutes.routes(adbDB));
        mainAppG.use('/admin', Serv_1.ExpressRPC.serveStatic('wwwAdmin'));
    }
    else {
        fs.open('ADB.sqlite', 'w', runSetup);
    }
}
catch (err) {
}
function runSetup() {
    mainAppG.use('/setup', Serv_1.ExpressRPC.serveStatic('setup'));
    adbDB.createNewADBwSchema('ADB.sqlite');
    const editorRoutes = new editor_1.EditorRoutes();
    mainAppG.use('/api/editors', editorRoutes.routes(adbDB));
    mainAppG.use('/editors', Serv_1.ExpressRPC.serveStatic('www'));
    const adminRoutes = new admin_1.AdminRoutes();
    mainAppG.use('/api/admin', adminRoutes.routes(adbDB));
    mainAppG.use('/admin', Serv_1.ExpressRPC.serveStatic('wwwAdmin'));
}
mainAppG.post("/setup", async (req, res) => {
    const method = req.fields.method;
    let params = JSON.parse(req.fields.params);
    let email = params.email;
    let password = params.password;
    let emailjs = params.emailjs;
    let pathToSite = params.pathToSite;
    let resp = {};
    if ('setup' == method) {
        resp.result = {};
        try {
            adbDB.addAdmin(email, password, emailjs, pathToSite);
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
mainAppG.listen(appPORT, () => {
    console.log(`mainAppG listening on port ${appPORT}!`);
    console.log(`======================================================`);
    console.log(`App is running at http://localhost:${appPORT}/editors/`);
    console.log(`Admin is running at http://localhost:${appPORT}/admin/`);
    console.log(`======================================================`);
});
