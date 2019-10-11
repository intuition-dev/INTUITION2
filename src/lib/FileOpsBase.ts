// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

import FileHound = require('filehound')

const logger = require('tracer').console()
import fs = require('fs-extra')

import yaml = require('js-yaml')
import path = require("path")


export class Dirs {
   dir: string
   constructor(dir_: string) {
      let dir = Dirs.slash(dir_)
      this.dir = dir
   }
   static slash(path_) {// windowze
      return path_.replace(/\\/g, '/')
   }
   static goUpOne(dir): string {
      return path.resolve(dir, '..')
   }

   getInDir(sub):any {
      console.log('method renamed use getFilesIn')
      return this.getFilesIn(sub)
   }
   getFilesIn(sub) {
      const rec = FileHound.create() //recursive
         .paths(this.dir + sub)
         .findSync()

      let ret: string[] = [] //empty string array
      const ll = this.dir.length + sub.length
      for (let s of rec) {//clean the strings
         //console.info(s)
         let n = s.substr(ll)
         //console.info(n)

         ret.push(n)
      }
      return ret
   }

   /**
    * Get list of dirs w/o root part
    */
   getShort() {
      let lst = this.getFolders()
      let ret: string[] = [] //empty string array
      const ll = this.dir.length
      logger.info(this.dir, ll)

      for (let s of lst) {//clean the strings
         //console.info(s)
         let n = s.substr(ll)
         //console.info(n)
         ret.push(n)
      }
      return ret
   }

   getFolders() {
      logger.info(this.dir)
      const rec = FileHound.create() //recursive
         .paths(this.dir)
         .findSync()
      let ret: string[] = [] //empty string array
      for (let val of rec) {//clean the strings
         val = Dirs.slash(val)
         let n = val.lastIndexOf('/')
         let s: string = val.substring(0, n)
         ret.push(s)
      }
      //logger.info(ret)

      return Array.from(new Set(ret))
   }//()
}//class

export class Dat {
   props: any
   _path: string
   constructor(path__: string) {
      let path_ = Dirs.slash(path__)
      //logger.info(path)
      this._path = path_

      let y
      if (fs.existsSync(path_ + '/dat.yaml'))
         y = yaml.load(fs.readFileSync(path_ + '/dat.yaml'))
      if (!y) y = {}
      this.props = y

      let keys = Object.keys(y)
      if (keys.includes('include')) this._addData()
   }
   
   write():Promise<string> {
      return new Promise((resolve, reject) => {
         try {
            let y = yaml.dump(this.props, {
               skipInvalid: true,
               noRefs: true,
               noCompatMode: true,
               condenseFlow: true
            })
            let p = this._path + '/dat.yaml'
            logger.info(p)
            fs.writeFileSync(p, y)
            resolve('OK')
         } catch (err) { logger.info(err); reject(err) }
      })//()
   }

   set(key, val) { // ex: 'title', 'My First Blog'
      this.props[key] = val
   }
   _addData() {
      let jn = this.props.include
      let fn = this._path + '/' + jn
      logger.info(fn)
      let jso = fs.readFileSync(fn)
      Object.assign(this.props, JSON.parse(jso.toString())) // merge
   }

   getAll(): Object {
      return this.props
   }//()
}//class

export class FileOps {
   root
   constructor(root_) {
      this.root = Dirs.slash(root_)
   }

   /** returns # of files with the name, used to archive ver */
   count(fileAndExt): number {

      const files = FileHound.create()
         .paths(this.root)
         .depth(0)
         .match(fileAndExt + '*')
         .findSync()

      return files.length
   }

   clone(src, dest): Promise<string> {
      return new Promise((resolve, reject) => {
         logger.info('copy?')

         fs.copySync(this.root + src, this.root + dest)

         let p = this.root + dest
         logger.info(p)
         const d = new Dat(p)
         d.write()
         logger.info('copy!')
         resolve('OK')
      })
   }//()

   write(destFile, txt) {
      logger.info(this.root + destFile)
      fs.writeFileSync(this.root + destFile, txt)
   }

   read(file): string {
      return fs.readFileSync(this.root + file).toString()
   }

   remove(path) {
      let dir_path = this.root + path
      logger.info('remove:' + dir_path)
      if (fs.existsSync(dir_path)) {
         fs.readdirSync(dir_path).forEach(function (entry) {
            fs.unlinkSync(dir_path + '/' + entry)
         })
         fs.rmdirSync(dir_path)
      }
   }
   removeFile(path) {
      let file_path = this.root + path
      fs.unlinkSync(file_path)
   }
}//class


module.exports = {
  Dat, Dirs, FileOps
}

