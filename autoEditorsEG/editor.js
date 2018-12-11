"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("mbake/lib/Base");
const Wa_1 = require("mbake/lib/Wa");
module.exports = () => {
    const express = require("express");
    const bodyParser = require("body-parser");
    const customCors = require('./custom-cors');
    const editorAuth = require('./editor-auth');
    const appE = express();
    appE.use(customCors);
    appE.use(editorAuth);
    appE.use(bodyParser.json());
    appE.use(bodyParser.urlencoded({ extended: true }));
    appE.get("/", (req, res) => {
        res.send('If you see this then token is valid');
    });
    appE.get('/one', function (req, res) {
        let dirs = new Base_1.Dirs('');
        dirs.getShort();
        let fo = new Wa_1.FileOps('');
        fo.read('');
        res.json({ "foo": "bar" });
    });
    return appE;
};
