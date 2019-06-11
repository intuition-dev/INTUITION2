#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdmZip = require("adm-zip");
var commandLineArgs = require("command-line-args");
var Base_1 = require("./lib/Base");
var Wa_1 = require("./lib/Wa");
var Spider_1 = require("./lib/Spider");
var FileOpsBase_1 = require("./lib/FileOpsBase");
var FileOpsExtra_1 = require("./lib/FileOpsExtra");
var cwd = process.cwd();
function version() {
    console.info('mbake-x CLI version: ' + Base_1.Ver.ver());
}
function help() {
}
var optionDefinitions = [
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
];
var argsParsed = commandLineArgs(optionDefinitions);
var arg = argsParsed.mbake - x;
console.info();
function frag(arg) {
    new FileOpsExtra_1.DownloadFrag(arg, true);
}
function unzipL() {
    var src = __dirname + '/slidesEx.zip';
    var zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracting example of markdown slides to ./slidesEx');
    process.exit();
}
function unzipH() {
    var src = __dirname + '/dash.zip';
    var zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracting an starter Dash web app to ./dash');
    process.exit();
}
function csv2Json(arg) {
    new FileOpsExtra_1.CSV2Json(arg).convert();
}
function map(arg) {
    new Spider_1.Map(arg).gen();
}
function comps(arg) {
    var pro = new Base_1.MBake().compsNBake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function prod(arg) {
    new Base_1.MBake().clearToProd(arg);
    process.exit();
}
function bakeP(arg) {
    var pro = new Base_1.MBake().bake(arg, 3);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function bakeS(arg) {
    var pro = new Base_1.MBake().bake(arg, 2);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function bakeD(arg) {
    var pro = new Base_1.MBake().bake(arg, 1);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
if (arg) {
    arg = FileOpsBase_1.Dirs.slash(arg);
    if (arg.startsWith('/')) {
    }
    else if (arg.startsWith('..')) {
        arg = arg.substring(2);
        var d = cwd;
        d = FileOpsBase_1.Dirs.slash(d);
        var n = d.lastIndexOf('/');
        d = d.substring(0, n);
        arg = d + arg;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
if (argsParsed.comps) {
    try {
        comps(arg);
    }
    catch (err) {
        console.info(err);
    }
}
else if (argsParsed.csv2Json)
    csv2Json(arg);
else if (argsParsed.watcher) {
    Wa_1.Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
}
else if (argsParsed.dash)
    unzipH();
else if (argsParsed.map)
    map(arg);
else if (argsParsed.slides)
    unzipL();
else if (argsParsed.prod)
    prod(arg);
else if (argsParsed.bakeP)
    bakeP(arg);
else if (argsParsed.bakeS)
    bakeS(arg);
else if (argsParsed.bakeD)
    bakeD(arg);
else if (argsParsed.ops)
    frag(arg);
else if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (!arg)
    help();
