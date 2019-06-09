#!/usr/bin/env node
// All rights reserved by MetaBake.org | Cekvenich, licensed under LGPL 3.0

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver,  MBake,  } from './lib/Base'
import { Wa,  } from './lib/Wa'
import { Map } from './lib/Spider'
import { Dirs } from './lib/FileOpsBase'
import { CSV2Json, DownloadFrag  } from './lib/FileOpsExtra'

// imports done /////////////////////////////////////////////
const cwd: string = process.cwd()

function version() {
   console.info('mbake-x CLI version: ' + Ver.ver()) // tsc
}

function help() {

}//()

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake-x', defaultOption: true },

   { name: 'watcher', alias: 'w', type: Boolean },

   { name: 'port', alias: 'p', type: String },
   { name: 'reload-port', alias: 'r', type: String },

   { name: 'prod', type: Boolean },
   { name: 'comps', alias: 'c', type: Boolean },

   { name: 'bakeP', type: Boolean },
   { name: 'bakeS', type: Boolean },
   { name: 'bakeD', type: Boolean },

   { name: 'ops', type: Boolean },

   { name: 'map', alias: 'm', type: Boolean },
   { name: 'csv2Json', alias: 'l', type: Boolean },

]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.mbake-x
console.info()

// ///////////////////////////////////////////////////////////////////////////////////////////


function frag(arg) {
   new DownloadFrag(arg, true)
}
///////

function unzipL() {
   let src: string = __dirname + '/slidesEx.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracting example of markdown slides to ./slidesEx')
   process.exit()
}
function unzipH() {
   let src: string = __dirname + '/dash.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracting an starter Dash web app to ./dash')
   process.exit()
}

//  ////////////////////////////////////////////////////////////////////////////////////////////////
function csv2Json(arg) {
   new CSV2Json(arg).convert()
}

function map(arg) {
   new Map(arg).gen()
}


function comps(arg) {
   let pro: Promise<string> = new MBake().compsNBake(arg, 0)
   pro.then(function (val) {
      console.log(val)
      process.exit()
   })
}

function prod(arg) {
   new MBake().clearToProd(arg)
   process.exit()
}
function bakeP(arg) {
   let pro: Promise<string> = new MBake().bake(arg, 3)
   pro.then(function (val) {
      console.log(val)
      process.exit()
   })
}
function bakeS(arg) {
   let pro: Promise<string> = new MBake().bake(arg, 2)
   pro.then(function (val) {
      console.log(val)
      process.exit()
   })
}
function bakeD(arg) {
   let pro: Promise<string> = new MBake().bake(arg, 1)
   pro.then(function (val) {
      console.log(val)
      process.exit()
   })
}

// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if (arg) {
   arg = Dirs.slash(arg)
   if (arg.startsWith('/')) {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Dirs.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0, n)
      arg = d + arg
   } else { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.comps) {
   try {
      comps(arg)
   } catch (err) {
      console.info(err)
   }
} else

   if (argsParsed.csv2Json)
      csv2Json(arg)
   else if (argsParsed.watcher) {
      Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
   }

   else if (argsParsed.dash)
      unzipH()
   else if (argsParsed.map)
      map(arg)
   else if (argsParsed.slides)
      unzipL()
   else if (argsParsed.prod)
      prod(arg)
   else if (argsParsed.bakeP)
      bakeP(arg)
   else if (argsParsed.bakeS)
      bakeS(arg)
   else if (argsParsed.bakeD)
      bakeD(arg)
   else if (argsParsed.ops)
      frag(arg)

   else if (argsParsed.version)
      version()
   else if (argsParsed.help)
      help()
   else if (!arg)
      help()
