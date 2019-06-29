// All rights reserved by MetaBake (MetaBake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

import { Dirs, FileOps, Dat} from 'mbake/lib/FileOpsBase'

import axios from 'axios'
import probe = require('probe-image-size')
import extractor = require('unfluff')//scrape

const SummarizerManager = require("node-summarizer").SummarizerManager
const cheerio = require('cheerio')

const logger = require('tracer').console()

// map
import sm = require('sitemap')
import traverse = require('traverse')
import lunr = require('lunr')

import yaml = require('js-yaml')

import fs = require('fs-extra')
import FileHound = require('filehound')


export class Map {
   _sitemap
   _root
   constructor(root) {
      if (!root || root.length < 1) {
         console.info('no path arg passed')
         return
         
      }
      this._root = root
   }
   gen():Promise<string> {
      return new Promise(function (resolve, reject) {

      const m = yaml.load(fs.readFileSync(this._root + '/map.yaml'))
      let jmenu = JSON.stringify(m.menu, null, 2)
      //menu done
      fs.writeFileSync(this._root + '/menu.json', jmenu)

      this._sitemap = sm.createSitemap({
         hostname: m['host']
      })

      //build sitemap
      let leaves = traverse(m.menu).reduce(function (acc, x) {
         if (this.isLeaf) acc.push(x)
         return acc
      }, [])
      // any items recursively
      let itemsRoot = m['itemsRoot']
      if (itemsRoot) {
         //visit each path
         const d = new Dirs(this._root + itemsRoot)
         leaves = leaves.concat(d.getFolders())
      }

      let arrayLength = leaves.length
      logger.info(arrayLength)
      for (let i = 0; i < arrayLength; i++) {
         try {
            let path = leaves[i]

            if (path.includes(this._root))
               path = path.replace(this._root, '')
            let fullPath = this._root + path

            let dat = new Dat(fullPath)
            let props = dat.getAll()
            logger.info(path)//, props)

            //priority
            let priority = props['priority']
            if (!priority) priority = 0.3

            let image = props['image']
            if (!image) {
               this._sitemap.add({
                  url: path,
                  changefreq: m['changefreq'],
                  priority: priority
               })
            } else {  //if it has image
               this._sitemap.add({
                  url: path,
                  changefreq: m['changefreq'],
                  priority: priority,
                  img: [{
                     url: image,
                     title: props['title'],
                     caption: props['title']
                  }]
               })
            }
         } catch (err) {
            logger.info(err)
         }
      }//for

      //validate and write
      const thiz = this
      this._sitemap.toXML(function (err, xml) {

         fs.writeFileSync(thiz._root + '/sitemap.xml', xml)
         console.info(' Sitemap ready')

         thiz._map(leaves)

      })// to XML write
      resolve('OK')
      })
   }//map()

   _map(leaves) {
      let documents = []

      let arrayLength = leaves.length
      for (let i = 0; i < arrayLength; i++) {
         try {
            let path = leaves[i]
            if (path.includes(this._root))
               path = path.replace(this._root, '')
            let fullPath = this._root + path

            // find all md files in fullPath
            const rec = FileHound.create() //recursive
               .paths(fullPath)
               .ext('md')
               .findSync()

            let text = ''
            for (let val of rec) {//clean the strings
               val = Dirs.slash(val)
               console.info(val)
               let txt1 = fs.readFileSync(val, "utf8")
               text = text + ' ' + txt1
            }//for
            const row = {
               id: path,
               body: text
            }
            documents.push(row)
         } catch (err) {logger.info(err)}
      }//for

      //fts index
      logger.info(documents.length)
      let idx = lunr(function () {
         this.ref('id')
         this.field('body')

         documents.forEach(function (doc) {
            this.add(doc)
         }, this)
      })//idx

      const jidx = JSON.stringify(idx)
      fs.writeFileSync(this._root + '/FTS.idx', jidx)

      console.info(' Map generated menu.json, sitemap.xml and FTS.idx(json) index in ' + this._root)

   }//()
}// class

// //////////////////////////////////////////////////////////////////////////////
export class Scrape {

   constructor() {
      axios.defaults.responseType = 'document'
   }

   //delete me
   tst() {
      const u1 = 'https://www.nbcnews.com/think/opinion/why-trump-all-americans-must-watch-ava-duvernay-s-central-ncna1019421'
      this.s(u1).then(function(ret){
         console.log(ret)
      })
   }

   // most likely write to dat.yaml after folder is named
   s(url:string, selector?:string) {
      return new Promise(function (resolve, reject) {
         try {
            console.info(url)
            //feed json items
            axios.get(url).then(function (response) {
               let ret = new Object()
               const $ = cheerio.load(response.data)
               if(!selector) selector = 'body'
               const textTags = $(selector)
               let full_text = textTags.text()
               let img = []
               $('img').each(function(){
                 img.push($(this).attr('src'))
               })
               ret['img'] = img
               let video = []
               $('video').each(function(){
                  video.push($(this).attr('src'))
               })
               ret['video'] = video
               let a = []
               $('a').each(function(){
                 let href:string =  $(this).attr('href')
                 if(href.includes('javascript:')) return
                 if(href.includes('mailto:')) return
                 var n = href.indexOf('?')
                 if(n>0) 
                    href = href.substring(0,n)
                 a.push(href)
               })
               ret['href'] = a 

               let data = extractor.lazy(response.data)
               ret['url'] = data.canonicalLink()
               ret['id'] = data.canonicalLink()

               ret['title'] = data.softTitle()
               ret['content_text'] = data.text()
               ret['image'] = data.image()
               ret['date_published'] = data.date()
               ret['author'] = data.author()
               ret['attachments'] = data.videos()
               ret['tags'] = data.tags()
               ret['description'] = data.description()

               // clean
               ret['title'] = Scrape.asci(ret['title'])
               ret['content_text'] = Scrape.asci(ret['content_text'])
               ret['description'] = Scrape.asci(ret['description'])
               full_text = Scrape.asci(full_text)

               const all = ret['title'] +' '+  ret['content_text'] +' '+  ret['description'] +' '+ full_text
               const Summarizer = new SummarizerManager(all, 1)
               ret['sentiment'] = Summarizer.getSentiment()

               let summary = Summarizer.getSummaryByFrequency()
               //fix to match feed.json
               ret['content_text'] = Scrape.asci(data.description())
               ret['description'] = summary.summary // use this for image tag
               ret['word_count'] = Scrape.countWords(full_text) 

               //image size
               const iurl = ret['image']          
               if(iurl) {
                  Scrape.getImageSize(iurl).then(function(sz){
                     ret['image_sz'] = sz
                     resolve(ret)
                  })
               } else resolve(ret)
            })
         } catch (err) {
            logger.warn(err)
            reject(err)
         }
      })//pro
   }

   static getImageSize(iurl_) {
      return probe(iurl_, {timeout: 3000})
   }

   static countWords(str) {
      return str.trim().split(/\s+/).length;
   }


   static asci(str) {
      if (!str) return ''
      const alpha_numeric = Array.from('\'"@,.?!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + ' ')
      let filterd_string = ''

      for (let i = 0; i < str.length; i++) {
         let char = str[i]
         let index = alpha_numeric.indexOf(char)
         if (index > -1) {
            filterd_string += alpha_numeric[index]
         }
      }
      return filterd_string
   }//()

}//class

module.exports = {
   Scrape, Map
}