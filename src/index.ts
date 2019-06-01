import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { Wa } from 'mbake/lib/Wa';
import { AdminRoutes } from './lib/admin';

const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
console.info(config);
const appE = ExpressRPC.makeInstance(config.corsUrlProd);
const editorsPort = config.editorAPIport;

/*
* E D I T O R S
*/

//express app for editors
const editorRoutes = new EditorRoutes();
appE.use('/editors', editorRoutes.routes(config));
appE.listen(editorsPort, () => {
   console.info(`appE listening on port ${editorsPort}!`);
});

// html
const wwwPort = config.editorsWwwPort;
// TODO
const wwwApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
wwwApp.use(ExpressRPC.serveStatic('www'));
wwwApp.listen(wwwPort, () => {
   console.info(`wwwApp listening on port ${wwwPort}!`);
});


Wa.watch(config.appMount, config.appPort);

/*
* A D M I N
*/

// api for admin
const adminPort = config.adminAPIport;
const adminApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
const adminRoutes = new AdminRoutes();
adminApp.use('/auth', adminRoutes.routes());
adminApp.listen(adminPort, () => {
   console.log(`wwwAdmin API listening on port ${adminPort}!`);
});



// html
const adminWPort = config.adminWwwPort;
const adminWApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
adminWApp.use(ExpressRPC.serveStatic('wwwAdmin'));
adminWApp.listen(adminWPort, () => {
   console.log(`adminWApp listening on port ${adminWPort}!`);
});