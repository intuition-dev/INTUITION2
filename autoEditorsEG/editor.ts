import { Dirs, BakeWrk, MBake } from 'mbake/lib/Base';
import { FileOps } from 'mbake/lib/Wa';

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

   // get dir .md file
   appE.get("/post", (req, res) => {
      let post_id = req.query.post_id;
      if (typeof post_id !== 'undefined') {
         let md = config.appMount + '/blog/' + post_id + '/text.md';
         fs.readFile(md, 'utf8', function(err, data) {  
            if (err) throw err;
            console.log(data);
            res.json(data);
         });
      } else {
         res.status(400);
         res.send({ error: 'no post_id' });
      }
   });

   // update .md file
   appE.put("/post", (req, res) => {
      let post_id = req.query.post_id;
      if (typeof post_id !== 'undefined') {
         let md = '/blog/' + post_id + '/text.md';
         let fileOps = new FileOps(config.appMount);
         fileOps.write(md, req.body);
         let runMbake = new MBake();
         runMbake.itemizeNBake(config.appMount);
        
         res.send('OK');
      } else {
         res.status(400);
         res.send({ error: 'no post_id' });
      }
   });

   // create new blog from the template
   appE.post("/new-post", (req, res) => {
      let post_id = req.query.post_id;
      console.log('post id ----------->', post_id);
      if (typeof post_id !== 'undefined') {
         // create new post folder
         let temp = '/template';
         let newPost = '/blog/' + post_id;
         let fileOps = new FileOps(config.appMount);
         fileOps.clone(temp, newPost);
         
         res.send('OK');
      } else {
         res.status(400);
         res.send({ error: 'no post_id' });
      }
   });

   return appE;
};