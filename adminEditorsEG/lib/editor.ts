import { Dirs, BakeWrk, MBake } from 'mbake/lib/Base';
import { CustomCors } from './custom-cors';
import { FileOps } from 'mbake/lib/Wa';
import { EditorAuth } from './editor-auth';

export class EditorRoutes {
   routes(config) {
      const express = require("express");
      const bodyParser = require("body-parser");
      const editorAuth = new EditorAuth();
      const fs = require('fs');
      const unzipper = require('unzipper');
      const path = require('path');
      
      const appE = express();
      const customCors = new CustomCors();
      
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
      
      // get .md file
      appE.get("/post", (req, res) => {
         let post_id = req.query.post_id;
         let pathPrefix = req.query.pathPrefix;
         if (typeof post_id !== 'undefined') {
            let md = config.appMount + '/' + pathPrefix + post_id;
            let fileExt = path.extname(post_id);
            if (fs.existsSync(md) && fileExt === '.md') {
               fs.readFile(md, 'utf8', function(err, data) {  
                  if (err) throw err;
                  console.log(data);
                  res.json(data);
               });
            }
         } else {
            res.status(400);
            res.send({ error: 'no post_id' });
         }
      });
      
      // update .md file
      appE.put("/post", (req, res) => {
         let post_id = req.query.post_id;
         let pathPrefix = req.query.pathPrefix;
         if (typeof post_id !== 'undefined') {
            let md = '/' + pathPrefix + post_id;
            let fileOps = new FileOps(config.appMount);
            fileOps.write(md, req.body);
            let runMbake = new MBake();
            runMbake.itemizeNBake(config.appMount + '/blog');
            runMbake.tag(config.appMount);
            
            res.send('OK');
         } else {
            res.status(400);
            res.send({ error: 'no post_id' });
         }
      });
      
      // create new blog from the template
      appE.post("/new-post", (req, res) => {
         let post_id = req.query.post_id;
         if (typeof post_id !== 'undefined') {
            // create new post folder
            fs.createReadStream(config.appMount + '/blog-post-template.zip')
            .pipe(unzipper.Extract({ path: '/tmp' }));
            let temp = '/tmp/blog-post-template';
      
            let newPost = config.appMount+ '/blog/' + post_id;
            let fileOps = new FileOps('/');
            fileOps.clone(temp, newPost);
            
            res.send('OK');
         } else {
            res.status(400);
            res.send({ error: 'no post_id' });
         }
      });
      
      return appE;
   };
}

module.exports = {
   EditorRoutes
}