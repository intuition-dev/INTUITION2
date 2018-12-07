declare var console: Console;

const express = require("express");
const adminPort = 3030;
const adminApp = express();

// express app for admin
const adminApp2 = require('./admin');
adminApp.use('/auth', adminApp2());

adminApp.listen(adminPort, () => {
    console.log(`adminApp listening on port ${adminPort}!`);
});