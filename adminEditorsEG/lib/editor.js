"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("mbake/lib/Base");
const custom_cors_1 = require("./custom-cors");
const Wa_1 = require("mbake/lib/Wa");
module.exports = (config) => {
    const express = require("express");
    const bodyParser = require("body-parser");
    const editorAuth = require('./editor-auth');
    const fs = require('fs');
    const unzipper = require('unzipper');
    const path = require('path');
    const appE = express();
    const customCors = new custom_cors_1.CustomCors();
    appE.use(customCors.cors());
    appE.use(editorAuth);
    appE.use(bodyParser.json());
    appE.use(bodyParser.text());
    appE.use(bodyParser.urlencoded({ extended: true }));
    appE.get("/posts", (req, res) => {
        let dirs = new Base_1.Dirs(config.appMount);
        let dirsToIgnore = ['', '.', '..'];
        res.send(dirs.getShort()
            .map(el => el.replace(/^\/+/g, ''))
            .filter(el => !dirsToIgnore.includes(el)));
    });
    appE.get("/files", (req, res) => {
        let post_id = '/' + req.query.post_id;
        if (typeof post_id !== 'undefined') {
            let dirs = new Base_1.Dirs(config.appMount);
            res.send(dirs.getInDir(post_id));
        }
        else {
            res.status(400);
            res.send({ error: 'no post_id' });
        }
    });
    appE.get("/post", (req, res) => {
        let post_id = req.query.post_id;
        let pathPrefix = req.query.pathPrefix;
        if (typeof post_id !== 'undefined') {
            let md = config.appMount + '/' + pathPrefix + post_id;
            let fileExt = path.extname(post_id);
            if (fs.existsSync(md) && fileExt === '.md') {
                fs.readFile(md, 'utf8', function (err, data) {
                    if (err)
                        throw err;
                    console.info(data);
                    res.json(data);
                });
            }
        }
        else {
            res.status(400);
            res.send({ error: 'no post_id' });
        }
    });
    appE.put("/post", (req, res) => {
        let post_id = req.query.post_id;
        let pathPrefix = req.query.pathPrefix;
        if (typeof post_id !== 'undefined') {
            let md = '/' + pathPrefix + post_id;
            let fileOps = new Wa_1.FileOps(config.appMount);
            fileOps.write(md, req.body);
            let runMbake = new Base_1.MBake();
            runMbake.itemizeNBake(config.appMount + '/blog');
            runMbake.tag(config.appMount);
            res.send('OK');
        }
        else {
            res.status(400);
            res.send({ error: 'no post_id' });
        }
    });
    appE.post("/new-post", (req, res) => {
        let post_id = req.query.post_id;
        console.info('post id ----------->', post_id);
        if (typeof post_id !== 'undefined') {
            fs.createReadStream(config.appMount + '/blog-post-template.zip')
                .pipe(unzipper.Extract({ path: '/tmp' }));
            let temp = '/tmp/blog-post-template';
            let newPost = config.appMount + '/blog/' + post_id;
            let fileOps = new Wa_1.FileOps('/');
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
