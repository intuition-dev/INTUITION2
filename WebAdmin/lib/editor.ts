import { Dirs, MBake, Dat, Ver } from 'mbake/lib/Base';
import { CustomCors } from './custom-cors';
import { FileOps, CSV2Json } from 'mbake/lib/Wa';
import { AppAuth } from './app-auth';

export class EditorRoutes {
    routes(config) {
        const express = require("express");
        const bodyParser = require("body-parser");
        const editorAuth = new AppAuth();
        const fs = require('fs');
        const path = require('path');
        const fileUpload = require('express-fileupload');

        const appE = express();
        const customCors = new CustomCors();

        appE.use(fileUpload());
        appE.use(customCors.cors());
        appE.use(editorAuth.auth());
        appE.use(bodyParser.json());
        appE.use(bodyParser.text());
        appE.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express

        // get dirs list
        appE.get("/posts", (req, res) => {
            let dirs = new Dirs(config.appMount);
            let dirsToIgnore = ['', '.', '..'];
            res.send(dirs.getShort()
                .map(el => el.replace(/^\/+/g, ''))
                .filter(el => !dirsToIgnore.includes(el))
            );
        });

        // get sub files in directory
        appE.get("/files", (req, res) => {
            let post_id = '/' + req.query.post_id;
            if (typeof post_id !== 'undefined') {
                let dirs = new Dirs(config.appMount);
                res.send(dirs.getInDir(post_id));
            } else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });

        // get .md/.yaml/.csv/.pug/.css file 
        appE.get("/post", (req, res) => {
            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;
            if (typeof post_id !== 'undefined') {
                let md = config.appMount + '/' + pathPrefix + post_id;
                let original_post_id = post_id.replace(/\.+\d+$/, "");
                let fileExt = path.extname(original_post_id);
                if (fs.existsSync(md) && (fileExt === '.md' || fileExt === '.yaml' || fileExt === '.csv' || fileExt === '.pug' || fileExt === '.css')) {
                    fs.readFile(md, 'utf8', function (err, data) {
                        if (err) throw err;
                        res.json(data);
                    });
                } else {
                    throw "Unknown file type!"
                }
            } else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });

        // update .md/.yaml/.csv/.pug/.css file
        appE.put("/post", (req, res) => {
            // TODO: What does this do?
            console.info("--res runnnning:")
            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;
            if (typeof post_id !== 'undefined') {

                let md = '/' + pathPrefix + post_id;

                let fileOps = new FileOps(config.appMount);
                fileOps.write(md, req.body);

                let dirCont = new Dirs(config.appMount);
                let substring = '/';

                // add /archive
                let checkDat = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat.yaml'));
                if (checkDat.length > 0) {
                    const archivePath = '/' + pathPrefix + '/archive';
                    if (!fs.existsSync(config.appMount + archivePath)) {
                        fs.mkdirSync(config.appMount + archivePath);
                    }

                    let archiveFileOps = new FileOps(config.appMount + archivePath);

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

            } else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });

        // build/compile mbake
        appE.put("/post-build", (req, res) => {

            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;

            console.info('post_id --->', post_id);
            console.info('pathPrefix --->', pathPrefix);

            if (typeof post_id !== 'undefined') {

                let runMbake = new MBake();
                let dirCont = new Dirs(config.appMount);

                let checkCsv = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('.csv'));
                if (checkCsv.length > 0) {
                    let compileCsv = new CSV2Json(config.appMount + '/' + pathPrefix);
                    compileCsv.convert();
                }

                let checkDat_i = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat_i.yaml'));

                //need to check what type of file is currently saving and run function based on it, eg: itemizeNbake, or comps
                if (checkDat_i.length > 0) {
                    // this is for yaml
                    runMbake.itemizeNBake(config.appMount + '/' + pathPrefix,3)
                        .then(function (response) {
                            res.send({ data: 'OK' });
                        }, function (error) {
                            res.send({ data: error });
                        })
                } else {
                    // TODO: When do we to do components? Why not just bake? md right.
                    runMbake.compsNBake(config.appMount,3).then(function (response) {
                        res.send({ data: 'OK' });
                    }, function (error) {
                        res.send({ data: error });
                    })
                }

            } else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }

        });

        // clone page
        appE.post("/new-post", (req, res) => {
            // TODO: there is a clone method in mbake CLI. Use that and maintain there.
            let post_id = req.query.post_id;
            let pathPrefix = req.query.pathPrefix;

            if (typeof post_id !== 'undefined'
                && typeof pathPrefix !== 'undefined'
            ) {
                // create new post folder
                let postPath = config.appMount + '/' + pathPrefix;
                let substring = '/';
                let newPost = '';
                if (pathPrefix.includes(substring)) {
                    pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                    newPost = config.appMount + '/' + pathPrefix + '/' + post_id;
                } else {
                    newPost = config.appMount + '/' + post_id;
                }
                let fileOps = new FileOps('/');
                fileOps.clone(postPath, newPost);

                res.send('OK');
            } else {
                res.status(400);
                res.send({ error: 'error creating a post' });
            }

        });

        // upload file
        appE.post("/upload", (req, res) => {
            let uploadPath;
            let pathPrefix = req.query.pathPrefix;

            if (Object.keys(req.files).length == 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            let sampleFile = req.files.sampleFile;
            uploadPath = config.appMount + '/' + pathPrefix + '/' + sampleFile.name;

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(uploadPath, function (err) {
                if (err) {
                    return res.status(500).send(err);
                }

                res.send('File uploaded!');
            });

        });

        // set publish date
        appE.put("/set-publish-date", (req, res) => {
            let post_id = req.body.post_id;
            let publish_date = req.body.publish_date;
            if (typeof post_id !== 'undefined') {
                let datYaml = new Dat(config.appMount + '/' + post_id);
                datYaml.set('publishDate', publish_date);
                datYaml.write();
                let runMbake = new MBake();
                let postsFolder = post_id.substr(0, post_id.indexOf('/'));
                let pro:Promise<string> = runMbake.itemizeNBake(config.appMount + '/' + postsFolder,3);
                res.send('OK');
            } else {
                res.status(400);
                res.send({ error: 'no post_id' });
            }
        });

        // get mbake version
        appE.get("/mbake-version", (req, res) => {

            let mbakeVer = new Ver();
            console.info('endpoint mbake version --------------> ', mbakeVer.ver());
            res.send(mbakeVer.ver());

        });

        return appE;
    };
}

module.exports = {
    EditorRoutes
}