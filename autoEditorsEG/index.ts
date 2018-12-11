const express = require('express');
const appE = express();
const editorsPort = 9090;

//express app for editors
const appE2 = require('./editor');
appE.use('/editor', appE2());

const wwwPort = 9000;
const wwwApp = express();

wwwApp.use(express.static('www'));

wwwApp.listen(wwwPort, () => {
    console.log(`wwwApp listening on port ${wwwPort}!`);
});

appE.listen(editorsPort, () => {
    console.log(`appE listening on port ${editorsPort}!`);
});