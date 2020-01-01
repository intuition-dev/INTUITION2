// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0

import { Dirs } from './FileOpsBase'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "file ops x"})
import fs = require('fs-extra')

import AdmZip = require('adm-zip')
import download = require('download')
import yaml = require('js-yaml')

export class DownloadC {
   // in docs root via git
   static truth: string = 'https://INTUITION-dev.github.io/mbCLI/versions.yaml'
   key: string
   targetDir: string

   constructor(key_: string, targetDir_: string) {
      this.key = key_
      this.targetDir = targetDir_
   }// cons

   autoUZ() { // and unzip
      const THIZ = this
      this.getVal().then(function (url: string) {
         log.info(url)
         const fn = THIZ.getFn(url)
         log.info(fn)
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
            //log.info(ver, lver)
            if (ver == lver) resolve(true)
            else resolve(false)
         })
      })//pro
   }

   getVal() { // from truth
      const THIZ = this
      return new Promise(function (resolve, reject) {
         download(DownloadC.truth).then(data => {
            let dic = yaml.load(data)
            resolve(dic[THIZ.key])
         }).catch(err => {
            log.info('err: where is the vfile?', err, DownloadC.truth)
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
            log.info('downloaded')
            resolve('OK')
         }).catch(err => {
            log.info('err: where is the file?', err, url)
         })
      })//pro
   }//()
   unzip(fn) {
      const zfn = this.targetDir + fn
      log.info(zfn)
      const zip = new AdmZip(zfn)
      zip.extractAllTo(this.targetDir, /*overwrite*/true)
      fs.remove(this.targetDir + '/' + fn)
   }
}//class

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class YamlConfig {
   constructor(fn) {
      let cfg = yaml.load(fs.readFileSync(fn))
      log.info(cfg)
      return cfg
   }//()
}//class

export class DownloadFrag {
   constructor(dir, ops: boolean) {
      log.info('Extracting to', dir)
      if (!ops) {
         new DownloadC('headFrag',dir).auto()
         new DownloadC('VM',  dir).auto()
         new DownloadC('Tests',  dir).auto()
         new DownloadC('Bind',  dir).auto()
      }
      if (ops) {
         new DownloadC('opsPug', dir).auto()
         new DownloadC('opsJs',  dir).auto()
      }//fi
   }//()
}

export class VersionNag {
   
   static isCurrent(prod, ver): Promise<boolean> {
      const down = new DownloadC(prod, null)
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
 DownloadFrag, YamlConfig, DownloadC, VersionNag, FileMethods
}
