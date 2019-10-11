// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

import { Dirs } from './FileOpsBase'

const logger = require('tracer').console()
import fs = require('fs-extra')

import csv2JsonV2 = require('csvtojson')

import AdmZip = require('adm-zip')
import download = require('download')
import yaml = require('js-yaml')

export class Download {
   // in docs root via git
   static truth: string = 'https://Intuition-DEV.github.io/mbCLI/versions.yaml'
   key: string
   targetDir: string

   constructor(key_: string, targetDir_: string) {
      this.key = key_
      this.targetDir = targetDir_
   }// cons

   autoUZ() { // and unzip
      const THIZ = this
      this.getVal().then(function (url: string) {
         logger.trace(url)
         const fn = THIZ.getFn(url)
         logger.trace(fn)
         THIZ.down(url, fn).then(function () {
            THIZ.unzip(fn)
         })
      })
   }

   auto() {
      const THIZ = this
      this.getVal().then(function (url: string) {
         const fn = THIZ.getFn(url)
         THIZ.down(url, fn)
      })
   }

   checkVer(lver): Promise<boolean> {
      const THIZ = this
      return new Promise(function (resolve, reject) {
         THIZ.getVal().then(function (ver: string) {
            //logger.trace(ver, lver)
            if (ver == lver) resolve(true)
            else resolve(false)
         })
      })//pro
   }

   getVal() { // from truth
      const THIZ = this
      return new Promise(function (resolve, reject) {
         download(Download.truth).then(data => {
            let dic = yaml.load(data)
            resolve(dic[THIZ.key])
         }).catch(err => {
            console.info('err: where is the file?', err)
         })
      })//pro
   }//()
   getFn(url: string): string {
      const pos = url.lastIndexOf('/')
      return url.substring(pos)
   }
   down(url, fn) {
      const THIZ = this
      return new Promise(function (resolve, reject) {
         download(url).then(data => {
            fs.writeFileSync(THIZ.targetDir + '/' + fn, data)
            logger.trace('downloaded')
            resolve('OK')
         }).catch(err => {
            console.info('err: where is the file?', err)
         })
      })//pro
   }//()
   unzip(fn) {
      const zfn = this.targetDir + fn
      logger.trace(zfn)
      const zip = new AdmZip(zfn)
      zip.extractAllTo(this.targetDir, /*overwrite*/true)
      fs.remove(this.targetDir + '/' + fn)
   }
}//class

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class YamlConfig {
   constructor(fn) {
      let cfg = yaml.load(fs.readFileSync(fn))
      console.info(cfg)
      return cfg
   }//()
}//class

export class CSV2Json { // TODO: get to work with watcher
   dir: string
   constructor(dir_: string) {
      if (!dir_ || dir_.length < 1) {
         console.info('no path arg passed')
         return
      }
      this.dir = Dirs.slash(dir_)
   }

   convert(): Promise<string> {
      return new Promise(function (resolve, reject) {
         let fn: string = this.dir + '/list.csv'
         if (!fs.existsSync(fn)) { //if it does not exist, go up a level
            console.info('not found')
            reject('not found')
         }
         let thiz = this
         logger.info('1')

         csv2JsonV2({ noheader: true }).fromFile(fn)
            .then(function (jsonO) {
               logger.info(jsonO)
               let fj: string = thiz.dir + '/list.json'

               fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3))
               resolve('OK')
            })
      })
   }//()
}

export class DownloadFrag {
   constructor(dir, ops: boolean) {
      console.log('Extracting to', dir)
      if (!ops) {
         new Download('headFrag',dir).auto()
         new Download('VM',  dir).auto()
         new Download('Bind',  dir).auto()
      }
      if (ops) {
         new Download('opsPug', dir).auto()
         new Download('opsJs',  dir).auto()
      }//fi
   }//()
}

export class VersionNag {
   
   static isCurrent(prod, ver): Promise<boolean> {
      const down = new Download(prod, null)
      return down.checkVer(ver)
   }
}

export class FileMethods {

   // get list of directories
   getDirs(mountPath:string) {
       let dirs = new Dirs(mountPath);
       let dirsToIgnore = ['.', '..'];
       return dirs.getShort()
           .map(el => el.replace(/^\/+/g, '')) //?
           .filter(el => !dirsToIgnore.includes(el));
   }

   // get files in directory
   getFiles(mountPath:string, item:string) { 

       let dirs = new Dirs(mountPath);
       let result = dirs.getInDir(item);
       
       if (item === '/') { // if root directory, remove all dirs from output, leave only files:
           return result.filter(file => file.indexOf('/') === -1 && !fs.lstatSync(mountPath + '/' + file).isDirectory());
       } else {
           return result;
       }
   }
}

module.exports = {
   CSV2Json, DownloadFrag, YamlConfig, Download, VersionNag, FileMethods
}
