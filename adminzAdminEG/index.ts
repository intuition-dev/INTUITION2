declare var console: Console;

import { AdminRoutes } from './lib/admin';
const express = require("express");

// html
const adminWPort = 8080;
const adminWApp = express();
adminWApp.use(express.static('www'));
adminWApp.listen(adminWPort, () => {
   console.info(`adminWApp listening on port ${adminWPort}!`);
});


//  api for admin
const adminPort = 3030;
const adminApp = express();
const adminRoutes = new AdminRoutes();
adminApp.use('/auth', adminRoutes.routes());
adminApp.listen(adminPort, () => {
    console.info(`adminApp listening on port ${adminPort}!`);
});
