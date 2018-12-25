declare var console: Console;

import { AdminRoutes } from './lib/admin';
const express = require("express");
const adminPort = 3030;
const adminApp = express();

const blogPort = 8080;
const blogApp = express();

blogApp.use(express.static('www'));

// express app for admin
const adminRoutes = new AdminRoutes();
adminApp.use('/auth', adminRoutes.routes());

adminApp.listen(adminPort, () => {
    console.log(`adminApp listening on port ${adminPort}!`);
});

blogApp.listen(blogPort, () => {
    console.log(`blogApp listening on port ${blogPort}!`);
});