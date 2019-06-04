import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { Wa } from 'mbake/lib/Wa';
import { AdminRoutes } from './lib/admin';

const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
const mainAppG = ExpressRPC.makeInstance(['http://localhost:9080']);
const appGPORT = '9081';
// const appE = ExpressRPC.makeInstance(config.corsUrlProd);
// const editorsPort = '/app'; // 9081

/*
* E D I T O R S
*/

//express app for editors
const editorRoutes = new EditorRoutes();
mainAppG.use('/api/editors', editorRoutes.routes(config));
// appE.listen(editorsPort, () => {
//    console.info(`appE listening on port ${editorsPort}!`);
// });

// html
// const wwwPort = 9080;
// TODO
// const wwwApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
mainAppG.use('/editors', ExpressRPC.serveStatic('www'));
// wwwApp.listen(wwwPort, () => {
//    console.info(`wwwApp listening on port ${wwwPort}!`);
// });


Wa.watch('/Users/liza/work/mbakeCLI/CMS', 9082);

/*
* A D M I N
*/

// api for admin
// const adminPort = config.adminAPIport;
// const adminApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
const adminRoutes = new AdminRoutes();
mainAppG.use('/api/admin', adminRoutes.routes());
// adminApp.listen(adminPort, () => {
//    console.log(`wwwAdmin API listening on port ${adminPort}!`);
// });



// html
// const adminWPort = 8080;
// const adminWApp = ExpressRPC.makeInstance(config.corsUrlAdmin);
mainAppG.use('/admin', ExpressRPC.serveStatic('wwwAdmin'));
// adminWApp.listen(adminWPort, () => {
//    console.log(`adminWApp listening on port ${adminWPort}!`);
// });


mainAppG.listen(appGPORT, () => {
   console.log(`mainAppG listening on port ${appGPORT}!`);
   console.log(`======================================================`);
   console.log(`App is running at http://localhost:${appGPORT}/editors/`);
   console.log(`Admin is running at http://localhost:${appGPORT}/admin/`);
   console.log(`======================================================`);
});