#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var clear = require("cli-clear");
var Base_1 = require("./lib/Base");
var Extra_1 = require("./lib/Extra");
var FileOpsBase_1 = require("./lib/FileOpsBase");
var Wa_1 = require("./lib/Wa");
var FileOpsExtra_1 = require("./lib/FileOpsExtra");
clear();
var cwd = process.cwd();
function version() {
    console.info('mbake CLI version: ' + Base_1.Ver.ver());
}
function help() {
    var b = new Base_1.Ver();
    console.info();
    console.info('mbake CLI version: ' + Base_1.Ver.ver());
    console.info();
    console.info('Usage:');
    console.info('  To process any_dir Pug to html recursively:                 mbake .');
    console.info('  For local watcher and server:                               mbake -w .');
    console.info('  Process SASS/SCSS file into css, requires assets.yaml:      mbake -s .');
    console.info('     or path that has assets.yaml, or any sub-folder under /assets');
    console.info('  Process .ts, .js and native web comps file to .min:         mbake -t .');
    console.info('  To process Pug and dat_i items to items.json:               mbake -i .');
    console.info('     or any sub-folder, where path is folder containing dat_i.yaml;');
    console.info('     also does regular mbake of Pug');
    console.info('  Download fragment to setup the app FW(framework):           mbake -f .');
    console.info('     Note: . is current directory, or use any path instead of .');
    console.info(' -------------------------------------------------------------');
    console.info();
    console.info(' Starters:');
    console.info('  For a starter website:                                      mbake -e');
    console.info('  For a starter CMS|items:                                    mbake -c');
    console.info('  For an example dynamic web app CRUD:                        mbake -u');
    console.info();
    console.info('  mbake-x npm CLI (extra) has watcher, components and more flags and examples');
    console.info();
    console.info(' Full docs: https://docs.MetaBake.org');
    console.info();
    console.info(' This is the CLI. For WebAdmin version of MetaBake, get from NPM or');
    console.info('   check this https://github.com/MetaBake/mbakeWebAdmin ');
    console.info();
    process.exit();
}
var optionDefinitions = [
    { name: 'mbake', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'items', alias: 'i', type: Boolean },
    { name: 'css', alias: 's', type: Boolean },
    { name: 'MinJS', alias: 't', type: Boolean },
    { name: 'frag', alias: 'f', type: Boolean },
    { name: 'CMS', alias: 'c', type: Boolean },
    { name: 'watcher', alias: 'w', type: Boolean },
    { name: 'website', alias: 'e', type: Boolean },
    { name: 'CRUD', alias: 'u', type: Boolean }
];
var argsParsed = commandLineArgs(optionDefinitions);
var arg = argsParsed.mbake;
console.info();
function unzipCRUD() {
    new FileOpsExtra_1.Download('CRUD', __dirname).autoZ();
    console.info('Extracting an example CRUD to ./CRUD');
}
function unzipS() {
    new FileOpsExtra_1.Download('website', __dirname).autoZ();
    console.info('Extracting a starter website to ./website');
}
function unzipE() {
    new FileOpsExtra_1.Download('CMS', __dirname).autoZ();
    console.info('Extracting a starter CMS app to ./CMS');
}
function frag(arg) {
    new FileOpsExtra_1.DownloadFrag(arg, false);
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
    else if (arg.startsWith('.')) {
        arg = cwd;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
function bake(arg) {
    var pro = new Base_1.MBake().bake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function itemize(arg) {
    var pro = new Base_1.MBake().itemizeNBake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function css(arg) {
    var pro = new Extra_1.Sas().css(arg);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function minJS(arg) {
    var min = new Extra_1.MinJS();
    var pro = min.ts(arg);
    pro.then(function (val) {
        console.log(val);
        min.min(arg);
    });
}
if (argsParsed.items)
    itemize(arg);
else if (argsParsed.css)
    css(arg);
else if (argsParsed.CMS)
    unzipE();
else if (argsParsed.CRUD)
    unzipCRUD();
else if (argsParsed.website)
    unzipS();
else if (argsParsed.MinJS)
    minJS(arg);
else if (argsParsed.frag)
    frag(arg);
else if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (argsParsed.watcher)
    Wa_1.Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
else if (!arg)
    help();
else
    bake(arg);
