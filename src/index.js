"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./lib/editor");
const admin_1 = require("./lib/admin");
const ADB_1 = require("./lib/ADB");
const bodyParser = require("body-parser");
const mainAppG = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
const appGPORT = '9081';
const fs = require('fs');
const pathToDb = 'ADB.sqlite';
const config_port = 3100;
mainAppG.use(bodyParser.json());
mainAppG.use(bodyParser.text());
mainAppG.use(bodyParser.urlencoded({ extended: true }));
try {
    if (fs.existsSync(pathToDb)) {
        const editorRoutes = new editor_1.EditorRoutes();
        mainAppG.use('/api/editors', editorRoutes.routes());
        mainAppG.use('/editors', Serv_1.ExpressRPC.serveStatic('www'));
        const adminRoutes = new admin_1.AdminRoutes();
        mainAppG.use('/api/admin', adminRoutes.routes());
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
            await ADB_1.ADB.createNewADBwSchema();
            await ADB_1.ADB.addAdmin(email, password, emailjs, pathToSite);
        }
        catch (err) {
        }
    }
    else {
        return res.json(resp);
    }
});
mainAppG.listen(appGPORT, () => {
    console.log(`mainAppG listening on port ${appGPORT}!`);
    console.log(`======================================================`);
    console.log(`App is running at http://localhost:${appGPORT}/editors/`);
    console.log(`Admin is running at http://localhost:${appGPORT}/admin/`);
    console.log(`======================================================`);
});
