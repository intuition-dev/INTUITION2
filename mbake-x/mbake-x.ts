#!/usr/bin/env node
// All rights reserved by MetaBake.org | Cekvenich, licensed under LGPL 3.0

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { MBake } from 'mbake/lib/Base'
import { Wa } from 'mbake/lib/Wa'
import { Map } from './lib/Spider'
import { Resize, Verx } from './lib/mbakeX'
import { Dirs, FileOps } from 'mbake/lib/FileOpsBase'
import { GitDown, ExportFS, ImportFS  } from './lib/mbakeX'
import { CSV2Json, DownloadFrag, VersionNag  } from 'mbake/lib/FileOpsExtra'

import { Cover } from './lib/cov'

// imports done /////////////////////////////////////////////
const cwd: string = process.cwd()

function version() {
   console.info('mbake-x CLI version: ' + Verx.ver()) // tsc
}

function help() {
   console.info()
   console.info('mbake-x CLI version: ' + Verx.ver()) // tsc
   console.info('  your node version is ' + process.version)
   console.info('  from ' + __dirname)
   console.info()
   console.info('Usage: ')
   console.info('  For local watcher and server on port:')
   console.info('    -p, --port to specify port for watcher:                    mbake-x -w . -p 8091 -r 9857')
   console.info('     (must be used with -r)')
   console.info('    -r, --reload-port to specify port for live reload :        mbake-x -w . --port=8091 --reload-port=9857')
   console.info()

   console.info('  To process Pug and RIOT *-comp.pug components:               mbake-x -c .')
   console.info('    -c also does regular mbake of Pug, not just comps.')
   console.info('  To bake with dev. ENV flag(1) in prod(default is 0):         mbake-x --bakeD .')
   console.info('  To bake with staging ENV flag(2) in prod:                    mbake-x --bakeS .')
   console.info('  To bake with production ENV flag(3) in prod:                 mbake-x --bakeP .')

   console.info()
   console.info('  Download fragment to setup the app devOps:                   mbake-x --ops .')
   console.info('  Add|clone an item|page from:to :                             mbake-x --add dir:source:target')

   console.info()

   console.info('  To map map.yaml to menu.json, sitemap.xml and FTS.idx:       mbake-x -m .')
   console.info('  Compress 3200 or larger .jpg images to 2 sizes:              mbake-x -i .')
   console.info('  To process list.csv to list.json:                            mbake-x -l .')
   console.info('  To download branch from git, in folder with gitdown.yaml:    mbake-x --gitDown .')
   console.info('     passing the git password of gitdown user')
   console.info()
   console.info('  To get a test coverage report of ViewModel and Test classes: mbake-x --cover ViewModelDir:TestDir')
   console.info('  To recursively remove source files:                          mbake-x --prod .')
   console.info('  To export FiresStore data, it needs two arguments separated ')
   console.info('   with ":" :                                                  mbake-x --exportFS serviceAccountKey:name_of_the_file:name_of_the_file_for_auth_data')
   console.info('  To import FireStore data, it needs two arguments separated  ')
   console.info('  with ":":                                                    mbake-x --importFS serviceAccountKey:name_of_exported_file:name_of_the_auth_data_exported_file')
   console.info()

   console.info('    Note: . is current directory, or use any path instead of .')
   console.info(' -------------------------------------------------------------')
   console.info()
   console.info(' Starters:')
   console.info('  For a starter dash web-app:                                 mbake-x -d')

   console.info('  For a Electron(pre-PhoneGap) app:                           mbake-x -e')
   console.info('  For a starter hybrid Phonegap app:                          mbake-x -o')
   console.info('  For an example Ad:                                          mbake-x -a')

   console.info()

}//()

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake-x', defaultOption: true },

   { name: 'help', alias: 'h', type: Boolean },
   { name: 'version', alias: 'v', type: Boolean },

   { name: 'watcher', alias: 'w', type: Boolean },

   { name: 'port', alias: 'p', type: String },
   { name: 'reload-port', alias: 'r', type: String },

   { name: 'prod', type: Boolean },
   { name: 'comps', alias: 'c', type: Boolean },

   { name: 'bakeP', type: Boolean },
   { name: 'bakeS', type: Boolean },
   { name: 'bakeD', type: Boolean },

   { name: 'ops', type: Boolean },
   { name: 'gitDown', type: Boolean },
   { name: 'add', type: Boolean },

   { name: 'cover', type: Boolean },

   { name: 'exportFS', type: Boolean },
   { name: 'importFS', type: Boolean },

   { name: 'map', alias: 'm', type: Boolean },
   { name: 'img', alias: 'i', type: Boolean },
   { name: 'csv2Json', alias: 'l', type: Boolean },

   { name: 'dash', alias: 'd', type: Boolean },
   { name: 'elect', alias: 'e', type: Boolean },
   { name: 'phonegap', alias: 'o', type: Boolean },
   { name: 'ad', alias: 'a', type: Boolean },
]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed['mbake-x']
console.info()

// ///////////////////////////////////////////////////////////////////////////////////////////
function git(arg) {
   let gg = new GitDown(arg)
   // gg.process()
}//()

function cover(arg) {
   var res = arg.split(':')
   const VMdir = res[0]
   const TestDir = res[1]
   Cover.run(VMdir, TestDir)
}

function exportFS(arg) {
   let ef = new ExportFS(arg)
}//()

function importFS(arg) {
   let ef = new ImportFS(arg)
}//()

function frag(arg) {
   new DownloadFrag(arg, true)
}

function add(arg) {
   const args = arg.split(':')
   let dir:string = args[0]
   if(dir.endsWith('.')) {
      dir = dir.slice(0, -1)
   }

   console.log(dir, args)
   const f = new FileOps(dir)
   f.clone(args[1], args[2])
}

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipG() {
   let src: string = __dirname + '/PGap.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracting a starter Phonegap app to ./PG')
}
function unzipE() {
   let src: string = __dirname + '/elect.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracting a starter Electron app to ./elect')
   process.exit()
}

function unzipD() {
   let src: string = __dirname + '/ad.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracting an example ad  ./ad')
}

function unzipH() {
   let src: string = __dirname + '/dash.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracting an starter Dash web app to ./dash')
}

//  ////////////////////////////////////////////////////////////////////////////////////////////////
function csv2Json(arg) {
   new CSV2Json(arg).convert()
}

function map(arg) {
   new Map(arg).gen()
}

function img(arg) {
   new Resize().do(arg)
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
   if (argsParsed.elect)
      unzipE()
   else if (argsParsed.phonegap)
      unzipG()
   else if (argsParsed.ad)
      unzipD()
   else if (argsParsed.csv2Json)
      csv2Json(arg)
   else if (argsParsed.watcher) {
      Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
   }
   else if (argsParsed.img) {
      img(arg)
   }
   else if (argsParsed.dash)
      unzipH()
   else if (argsParsed.map)
      map(arg)
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
   else if (argsParsed.gitDown)
      git(arg)
   else if (argsParsed.add)
      add(arg)
   else if (argsParsed.exportFS)
      exportFS(arg)
   else if (argsParsed.importFS)
      importFS(arg)
   else if (argsParsed.cover)
      cover(arg)
   else if (argsParsed.version)
      version()
   else if (argsParsed.help)
      help()
   else if (!arg)
      help()


      
VersionNag.isCurrent('mbakex', Verx.ver() ).then(function(isCurrent_:boolean){
   try{
   if(!isCurrent_) 
      console.log('There is a newer version of mbake-x, please update.')
   else
      console.log('You have the current version of mbake-x')
   } catch(err) {
      console.log(err)
   }
})// 
