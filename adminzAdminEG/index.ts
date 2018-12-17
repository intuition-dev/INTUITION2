declare var console: Console;

const express = require("express");
const adminPort = 3030;
const adminApp = express();

const blogPort = 8080;
const blogApp = express();

blogApp.use(express.static('www'));

// express app for admin
const adminApp2 = require('./lib/admin');
adminApp.use('/auth', adminApp2());

adminApp.listen(adminPort, () => {
    console.log(`adminApp listening on port ${adminPort}!`);
});

blogApp.listen(blogPort, () => {
    console.log(`blogApp listening on port ${blogPort}!`);
});