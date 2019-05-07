"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("mbake/lib/Base");
const custom_cors_1 = require("./custom-cors");
const Wa_1 = require("mbake/lib/Wa");
const app_auth_1 = require("./app-auth");
class EditorRoutes {
    routes(config) {
        const express = require("express");
        const bodyParser = require("body-parser");
        const editorAuth = new app_auth_1.AppAuth();
        const fs = require('fs');
        const path = require('path');
        const fileUpload = require('express-fileupload');
        const appE = express();
        const customCors = new custom_cors_1.CustomCors();
        appE.use(fileUpload());
        appE.use(customCors.cors());
        appE.use(editorAuth.auth());
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
                let original_post_id = post_id.replace(/\.+\d+$/, "");
                let fileExt = path.extname(original_post_id);
                if (fs.existsSync(md) && (fileExt === '.md' || fileExt === '.yaml' || fileExt === '.csv' || fileExt === '.pug' || fileExt === '.css')) {
                    fs.readFile(md, 'utf8', function (err, data) {
                        if (err)
                            throw err;
                        res.json(data);
                    });
                }
                else {
                    throw "Unknown file type!";
                }
            }
            else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });
        appE.put("/post", (req, res) => {
            console.info("--res runnnning:");
            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;
            if (typeof post_id !== 'undefined') {
                let md = '/' + pathPrefix + post_id;
                let fileOps = new Wa_1.FileOps(config.appMount);
                fileOps.write(md, req.body);
                let dirCont = new Base_1.Dirs(config.appMount);
                let substring = '/';
                let checkDat = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat.yaml'));
                if (checkDat.length > 0) {
                    const archivePath = '/' + pathPrefix + '/archive';
                    if (!fs.existsSync(config.appMount + archivePath)) {
                        fs.mkdirSync(config.appMount + archivePath);
                    }
                    let archiveFileOps = new Wa_1.FileOps(config.appMount + archivePath);
                    let extension = path.extname(post_id);
                    let fileName = path.basename(post_id, extension);
                    let count = archiveFileOps.count(path.basename(post_id));
                    let archiveFileName = '/' + fileName + extension + '.' + count;
                    archiveFileOps.write(archiveFileName, req.body);
                }
                if (pathPrefix.includes(substring)) {
                    pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                }
                res.send({ data: 'OK' });
            }
            else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });
        appE.put("/post-build", (req, res) => {
            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;
            console.info('post_id --->', post_id);
            console.info('pathPrefix --->', pathPrefix);
            if (typeof post_id !== 'undefined') {
                let runMbake = new Base_1.MBake();
                let dirCont = new Base_1.Dirs(config.appMount);
                let checkCsv = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('.csv'));
                if (checkCsv.length > 0) {
                    let compileCsv = new Wa_1.CSV2Json(config.appMount + '/' + pathPrefix);
                    compileCsv.convert();
                }
                let checkDat_i = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat_i.yaml'));
                if (checkDat_i.length > 0) {
                    runMbake.itemizeNBake(config.appMount + '/' + pathPrefix, 3)
                        .then(function (response) {
                        res.send({ data: 'OK' });
                    }, function (error) {
                        res.send({ data: error });
                    });
                }
                else {
                    runMbake.compsNBake(config.appMount, 3).then(function (response) {
                        res.send({ data: 'OK' });
                    }, function (error) {
                        res.send({ data: error });
                    });
                }
            }
            else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });
        appE.post("/new-post", (req, res) => {
            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;
            if (typeof post_id !== 'undefined'
                && typeof pathPrefix !== 'undefined') {
                let postPath = config.appMount + '/' + pathPrefix;
                let substring = '/';
                let newPost = '';
                if (pathPrefix.includes(substring)) {
                    pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                    newPost = config.appMount + '/' + pathPrefix + '/' + post_id;
                }
                else {
                    newPost = config.appMount + '/' + post_id;
                }
                let fileOps = new Wa_1.FileOps('/');
                fileOps.clone(postPath, newPost);
                res.send('OK');
            }
            else {
                res.status(400);
                res.send({ error: 'error creating a post' });
            }
        });
        appE.post("/upload", (req, res) => {
            let uploadPath;
            let pathPrefix = req.query.pathPrefix;
            if (Object.keys(req.files).length == 0) {
                return res.status(400).send('No files were uploaded.');
            }
            let sampleFile = req.files.sampleFile;
            uploadPath = config.appMount + '/' + pathPrefix + '/' + sampleFile.name;
            sampleFile.mv(uploadPath, function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.send('File uploaded!');
            });
        });
        appE.put("/set-publish-date", (req, res) => {
            let post_id = req.body.post_id;
            let publish_date = req.body.publish_date;
            if (typeof post_id !== 'undefined') {
                let datYaml = new Base_1.Dat(config.appMount + '/' + post_id);
                datYaml.set('publishDate', publish_date);
                datYaml.write();
                let runMbake = new Base_1.MBake();
                let postsFolder = post_id.substr(0, post_id.indexOf('/'));
                let pro = runMbake.itemizeNBake(config.appMount + '/' + postsFolder, 3);
                res.send('OK');
            }
            else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });
        appE.get("/mbake-version", (req, res) => {
            let mbakeVer = new Base_1.Ver();
            console.info('endpoint mbake version --------------> ', mbakeVer.ver());
            res.send(mbakeVer.ver());
        });
        return appE;
    }
    ;
}
exports.EditorRoutes = EditorRoutes;
module.exports = {
    EditorRoutes
};
