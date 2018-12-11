import { Dirs } from 'mbake/lib/Base';
import { FileOps } from 'mbake/lib/Wa';

module.exports = (config) => {
   const express = require("express");
   const bodyParser = require("body-parser");
   const customCors = require('./custom-cors');
   const editorAuth = require('./editor-auth');

   const appE = express();

   appE.use(customCors);
   appE.use(editorAuth);
   appE.use(bodyParser.json());
   appE.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express

   // appE.get("/", (req, res) => {
   //    //res.send('If you see this then token is valid');
   //    res.send(config);
   // });

   // get dirs list
   appE.get("/posts", (req, res) => {
      let dirs = new Dirs(config.appMount);
      let dirsToIgnore = ['', '.', '..', 'template'];
      res.send(dirs.getShort()
         .map(el => el.replace(/^\/+/g, ''))
         .filter(el => !dirsToIgnore.includes(el))
      );
   });

   appE.get('/one', function (req, res) {
      let fo = new  FileOps('');
      fo.read('');

      res.json({"foo": "bar"});
   });

   return appE;
};