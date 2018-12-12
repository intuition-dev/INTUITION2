"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("mbake/lib/Base");
const Wa_1 = require("mbake/lib/Wa");
module.exports = (config) => {
    const express = require("express");
    const bodyParser = require("body-parser");
    const customCors = require('./custom-cors');
    const editorAuth = require('./editor-auth');
    const fs = require('fs');
    const appE = express();
    appE.use(customCors);
    appE.use(editorAuth);
    appE.use(bodyParser.json());
    appE.use(bodyParser.text());
    appE.use(bodyParser.urlencoded({ extended: true }));
    appE.get("/posts", (req, res) => {
        let dirs = new Base_1.Dirs(config.appMount);
        let dirsToIgnore = ['', '.', '..', 'template'];
        res.send(dirs.getShort()
            .map(el => el.replace(/^\/+/g, ''))
            .filter(el => !dirsToIgnore.includes(el)));
    });
    appE.get("/post", (req, res) => {
        let post_id = req.query.post_id;
        if (typeof post_id !== 'undefined') {
            let md = config.appMount + '/' + post_id + '/text.md';
            fs.readFile(md, 'utf8', function (err, data) {
                if (err)
                    throw err;
                console.log(data);
                res.json(data);
            });
        }
        else {
            res.status(400);
            res.send({ error: 'no post_id' });
        }
    });
    appE.put("/post", (req, res) => {
        let post_id = req.query.post_id;
        if (typeof post_id !== 'undefined') {
            let md = '/' + post_id + '/text.md';
            let fileOps = new Wa_1.FileOps(config.appMount);
            fileOps.write(md, req.body);
            let runMbake = new Base_1.MBake();
            runMbake.itemizeNBake(config.appMount);
            res.send('OK');
        }
        else {
            res.status(400);
            res.send({ error: 'no post_id' });
        }
    });
    appE.post("/new-post", (req, res) => {
        let post_id = req.query.post_id;
        console.log('post id ----------->', post_id);
        if (typeof post_id !== 'undefined') {
            let temp = '/template';
            let newPost = '/' + post_id;
            let fileOps = new Wa_1.FileOps(config.appMount);
            fileOps.clone(temp, newPost);
            res.send('OK');
        }
        else {
            res.status(400);
            res.send({ error: 'no post_id' });
        }
    });
    return appE;
};
