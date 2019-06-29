// All rights reserved by MetaBake (MetaBake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

export class Verx {
   static ver() {
      return 'v1.07.03'
   }
   static date(): string {
      return new Date().toISOString()
   }
}

import sharp = require('sharp')
import probe = require('probe-image-size')
import { firestoreExport, firestoreImport } from 'node-firestore-import-export';
import * as firebase from 'firebase-admin';

const execa = require('execa')

// OK
const logger = require('tracer').console()
import FileHound = require('filehound')
import fs = require('fs-extra')
import yaml = require('js-yaml')

// //////////////////////////////////////////////////////////////////
export class GitDown {
   config
   remote
   pass: string
   git: any
   dir: string
   constructor(pass_) {
      var standard_input = process.stdin;

      // Set input character encoding.
      standard_input.setEncoding('utf-8');

      // Prompt user to input data in console.
      console.log("Please, enter your git password.");

      // When user input data and click enter key.
      standard_input.on('data', (password) => {

         // User input exit.
         if (password === 'exit\n') {
            console.log("Input failed.");
            process.exit();
         } else {
            console.log('password', password);

            const last = pass_.lastIndexOf('/')
            this.pass = password.replace(/\n/g, '');
            this.dir = pass_.substring(0, last);

            this.config = yaml.load(fs.readFileSync('gitdown.yaml'))
            console.log(this.dir, this.config.BRANCH)
            logger.trace(this.config)

            this.remote = 'https://' + this.config.LOGINName + ':'
            this.remote += this.pass + '@'
            this.remote += this.config.REPO + '/'
            this.remote += this.config.PROJECT

            this._emptyFolders();
            this.process();
         }
      })
   }//()

   async process() {
      try {
         let b = this.config.BRANCH
         await this._branchExists(b)
         console.log(this.exists)

         if (this.exists) await this._getEXISTINGRemoteBranch(b)
         else await this._getNEWRemoteBranch(b)

         this._moveTo(b)
      } catch (err) {
         console.error(err);
         process.exit();
      }
   }

   _moveTo(branch) { // move to folder
      let dir = this.config.PROJECT
      dir = this.dir + '/' + dir + '/' + this.config.REPOFolder

      let dirTo = this.config.PROJECT
      dirTo = this.dir + '/' + this.config.LOCALFolder
      console.log(dir, dirTo)

      fs.moveSync(dir, dirTo)

      let dirR = this.config.PROJECT
      dirR = this.dir + '/' + dirR
      fs.removeSync(dirR)
      console.log('removed', dirR)
      console.log()

      fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: Verx.date() })
      console.log('DONE!')
      console.log('Maybe time to make/bake', dirTo)
      console.log('and then point http server to', dirTo)
      console.log()
      process.exit()
   }

   _emptyFolders() {
      let dirR = this.config.PROJECT
      dirR = this.dir + '/' + dirR
      console.log('remove', dirR)
      fs.removeSync(dirR)

      let dirTo = this.config.PROJECT
      dirTo = this.dir + '/' + this.config.LOCALFolder
      console.log('remove', dirTo)
      fs.removeSync(dirTo)
   }

   async _getNEWRemoteBranch(branch) {
      const { stdout } = await execa('git', ['clone', this.remote])

      let dir = this.config.PROJECT
      dir = this.dir + '/' + dir
      //make a branch
      const { stdout2 } = await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir })
      const { stdout3 } = await execa('git', ['checkout', '-b', branch], { cwd: dir })
      // add to remote
      const { stdout4 } = await execa('git', ['push', '-u', 'origin', branch], { cwd: dir })

      /* list history of the new branch TODO
      await execa('git', ['fetch'], {cwd: dir})
      const {stdout10} = await execa('git', ['log', '-8', '--oneline', 'origin/'+branch], {cwd: dir})
      console.log('history', stdout10)
      /*
      git clone https://cekvenich:PASS@github.com/cekvenich/alan
      cd folder
      git remote add test2 https://cekvenich:PASS@github.com/cekvenich/alan
      git checkout -b test2
      git push -u origin test2
      */
   }

   async _getEXISTINGRemoteBranch(branch) { // if null, master
      const { stdout } = await execa('git', ['clone', this.remote])

      let dir = this.config.PROJECT
      dir = this.dir + '/' + dir
      const { stdout2 } = await execa('git', ['checkout', branch], { cwd: dir })
      console.log(dir, branch)

      /* list history of the branch TODO
      await execa('git', ['fetch'], {cwd: dir})
      const {stdout10} = await execa('git', ['log', '-8', '--oneline', 'origin/'+branch], {cwd: dir})
      console.log('history', stdout10)
      /*
      git clone https://cekvenich:PASS@github.com/cekvenich/alan
      cd folder
      git checkout test2
      */
   }

   exists: boolean
   async _branchExists(branch) {
      let cmd = this.remote
      cmd += '.git'
      logger.info(cmd)

      const { stdout } = await execa('git', ['ls-remote', cmd])
      this.exists = stdout.includes(branch)

      logger.trace(stdout)
      /*
      git ls-remote https://cekvenich:PASS@github.com/cekvenich/alan.git
      */
   }//()
}//class

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Resize {

   do(dir) {
      logger.info(dir)

      const rec = FileHound.create() //recursive
         .paths(dir)
         .ext('jpg')
         .findSync()

      let ret: string[] = [] //empty string array
      for (let s of rec) {//clean the strings
         let n = s.slice(0, -4)
         if (n.includes('.min')) continue
         ret.push(n)

      }
      for (let s of ret) {
         this.smaller(s)
      }
   }

   isWide(file): boolean {
      let data = fs.readFileSync(file + '.jpg')
      let p = probe.sync(data)
      if (p.width && p.width > 3200) return true
      logger.info(file, ' is low res')
      return false
   }

   smaller(file) {
      logger.info(file)
      if (!this.isWide(file)) return
      sharp(file + '.jpg')
         .resize(1680 * 1.9)
         .jpeg({
            quality: 74,
            progressive: true,
            trellisQuantisation: true
         })
         .blur()
         .toFile(file + '.2K.min.jpg')

      sharp(file + '.jpg')
         .resize(320 * 2)
         .jpeg({
            quality: 78,
            progressive: true,
            trellisQuantisation: true
         })
         .toFile(file + '.32.min.jpg')

   }//()

}//class

// //////////////////////////////////////////////////////////////////
export class ExportFS {
   args: string;
   serviceAccountConfig: string;
   collectionRef: any;
   pathToDataExportFile: string;
   pathToAuthExportFile: string;
   config: string;
   users: any = [];

   constructor(config) {
      this.args = config.split(':');
      this.serviceAccountConfig = this.args[0];
      this.pathToDataExportFile = this.args[1];
      this.pathToAuthExportFile = this.args[2];
      this.config = require(this.serviceAccountConfig + '.json');

      firebase.initializeApp({
         credential: firebase.credential.cert(this.config),
      });

      this.collectionRef = firebase.firestore();

      this.listAllUsers();
   }//()

   export() {
      firestoreExport(this.collectionRef)
         .then(data => {
            console.log(data)
            console.log(this.users)
            fs.writeJsonSync(this.pathToDataExportFile + '.json', data, 'utf8');
            fs.writeJsonSync(this.pathToAuthExportFile + '.json', this.users, 'utf8');
            process.exit();
         });
   }

   listAllUsers(nextPageToken?) {
      const listUsersArguments = [1000];

      if (nextPageToken) {
         listUsersArguments.push(nextPageToken);
      }

      firebase.auth().listUsers(...listUsersArguments)
         .then((listUsersResult) => {
            listUsersResult.users.forEach(user => {
               this.users.push(user.toJSON())
            });
            console.log('-------------------------- this.users', this.users)

            if (listUsersResult.pageToken) {
               this.listAllUsers(listUsersResult.pageToken);
            } else {
               this.export();
            }
         })
         .catch(function (error) {
            console.log(error);
            process.exit();
         });
   }
}

export class ImportFS {
   args: string;
   config: string;
   dir: string;
   authConfig: any;
   collectionRef: any;
   pathToData: string;
   serviceAccountConfig: string;
   pathToDatabaseImportedFile: string;
   pathToAuthImportedFile: string;

   constructor(config) {
      this.args = config.split(':');
      this.serviceAccountConfig = this.args[0];
      this.dir = this.serviceAccountConfig.substr(0, this.serviceAccountConfig.lastIndexOf("/"));
      this.pathToDatabaseImportedFile = this.args[1];
      this.pathToAuthImportedFile = this.args[2];
      this.config = require(this.serviceAccountConfig + '.json');
      // this.authConfig = require(this.dir + '/auth_key_salt_separator.json');

      firebase.initializeApp({
         credential: firebase.credential.cert(this.config),
      });

      this.collectionRef = firebase.firestore()
      this.import();
   }//()

   import() {
      let _this = this
      fs.readJson(this.pathToDatabaseImportedFile + '.json', (err, importData) => {
         console.log(err);

         firestoreImport(importData, _this.collectionRef)
            .then(() => {
               console.log('Data was imported.');

               fs.readJson(this.pathToAuthImportedFile + '.json', (err, result) => {
                  console.log(err);

                  // Converting user passwords to buffers
                  const users = result.map(user => {
                     // console.log(user.passwordSalt, this.authConfig.saltSeparator)
                     return { ...user, passwordHash: Buffer.from(user.passwordHash), passwordSalt: Buffer.from(user.passwordSalt) }
                  });

                  firebase.auth().importUsers(users, {
                     hash: {
                        // key: Buffer.from(this.authConfig.key, 'base64'),
                        // saltSeparator: Buffer.from(this.authConfig.saltSeparator),
                        algorithm: 'STANDARD_SCRYPT',
                        memoryCost: 1024,
                        parallelization: 16,
                        blockSize: 8,
                        derivedKeyLength: 64
                     }
                  })
                     .then((userImportResult) => {
                        console.log('Users Data was imported.');

                        userImportResult.errors.forEach((indexedError) => {
                           console.log(' failed to import', indexedError.error);
                        });
                        process.exit();
                     })
                     .catch((error) => {
                        console.log('error', error)
                        process.exit();
                     });
               })
            }).catch(e => {
               console.log(e)
               process.exit();
            });
      })
   }
}

module.exports = {
   Resize, ExportFS, ImportFS, GitDown, Verx
}
