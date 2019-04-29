"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("./lib/editor");
const Wa_1 = require("mbake/lib/Wa");
const admin_1 = require("./lib/admin");
const admin_rpc_1 = require("./lib/admin-rpc");
const express = require('express');
const appE = express();
const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
console.info(config);
const editorsPort = config.editorAPIport;
const editorRoutes = new editor_1.EditorRoutes();
appE.use('/editors', editorRoutes.routes(config));
appE.listen(editorsPort, () => {
    console.info(`appE listening on port ${editorsPort}!`);
});
const wwwPort = config.editorsWwwPort;
const wwwApp = express();
wwwApp.use(express.static('www'));
wwwApp.listen(wwwPort, () => {
    console.info(`wwwApp listening on port ${wwwPort}!`);
});
Wa_1.Wa.watch(config.appMount, config.appPort);
const adminPort = config.adminAPIport;
const adminApp = express();
const adminRoutes = new admin_1.AdminRoutes();
adminApp.use('/auth', adminRoutes.routes());
adminApp.listen(adminPort, () => {
    console.log(`wwwAdmin API listening on port ${adminPort}!`);
});
const adminPort2 = config.adminAPIportRps;
const adminRoutesRpc = new admin_rpc_1.AdminRoutesRpc();
adminApp.use('/auth', adminRoutesRpc.routes());
adminApp.listen(adminPort2, () => {
    console.log(`wwwAdmin API RPC listening on port ${adminPort2}!`);
});
const adminWPort = 8080;
const adminWApp = express();
adminWApp.use(express.static('wwwAdmin'));
adminWApp.listen(adminWPort, () => {
    console.log(`adminWApp listening on port ${adminWPort}!`);
});
