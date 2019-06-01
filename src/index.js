"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./lib/editor");
const Wa_1 = require("mbake/lib/Wa");
const admin_1 = require("./lib/admin");
const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
console.info(config);
const appE = Serv_1.ExpressRPC.makeInstance(config.corsUrlProd);
const editorsPort = config.editorAPIport;
const editorRoutes = new editor_1.EditorRoutes();
appE.use('/editors', editorRoutes.routes(config));
appE.listen(editorsPort, () => {
    console.info(`appE listening on port ${editorsPort}!`);
});
const wwwPort = config.editorsWwwPort;
const wwwApp = Serv_1.ExpressRPC.makeInstance(config.corsUrlAdmin);
wwwApp.use(Serv_1.ExpressRPC.serveStatic('www'));
wwwApp.listen(wwwPort, () => {
    console.info(`wwwApp listening on port ${wwwPort}!`);
});
Wa_1.Wa.watch(config.appMount, config.appPort);
const adminPort = config.adminAPIport;
const adminApp = Serv_1.ExpressRPC.makeInstance(config.corsUrlAdmin);
const adminRoutes = new admin_1.AdminRoutes();
adminApp.use('/auth', adminRoutes.routes());
adminApp.listen(adminPort, () => {
    console.log(`wwwAdmin API listening on port ${adminPort}!`);
});
const adminWPort = config.adminWwwPort;
const adminWApp = Serv_1.ExpressRPC.makeInstance(config.corsUrlAdmin);
adminWApp.use(Serv_1.ExpressRPC.serveStatic('wwwAdmin'));
adminWApp.listen(adminWPort, () => {
    console.log(`adminWApp listening on port ${adminWPort}!`);
});
