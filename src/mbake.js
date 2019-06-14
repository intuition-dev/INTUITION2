#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandLineArgs = require("command-line-args");
const clear = require("cli-clear");
const Base_1 = require("./lib/Base");
const Extra_1 = require("./lib/Extra");
const FileOpsBase_1 = require("./lib/FileOpsBase");
const Wa_1 = require("./lib/Wa");
const FileOpsExtra_1 = require("./lib/FileOpsExtra");
clear();
const cwd = process.cwd();
function version() {
    console.info('mbake CLI version: ' + Base_1.Ver.ver());
}
function help() {
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
    console.info('  mbake-x CLI (extra) has more flags');
    console.info();
    console.info(' Full docs: https://docs.MetaBake.org');
    console.info();
    process.exit();
}
const optionDefinitions = [
    { name: 'mbake', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'items', alias: 'i', type: Boolean },
    { name: 'css', alias: 's', type: Boolean },
    { name: 'MinJS', alias: 't', type: Boolean },
    { name: 'frag', alias: 'f', type: Boolean },
    { name: 'watcher', alias: 'w', type: Boolean },
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbake;
console.info();
function frag(arg) {
    new FileOpsExtra_1.DownloadFrag(arg, false);
}
if (arg) {
    arg = FileOpsBase_1.Dirs.slash(arg);
    if (arg.startsWith('/')) {
    }
    else if (arg.startsWith('..')) {
        arg = arg.substring(2);
        let d = cwd;
        d = FileOpsBase_1.Dirs.slash(d);
        let n = d.lastIndexOf('/');
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
    let pro = new Base_1.MBake().bake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function itemize(arg) {
    let pro = new Base_1.MBake().itemizeNBake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function css(arg) {
    let pro = new Extra_1.Sas().css(arg);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function minJS(arg) {
    let min = new Extra_1.MinJS();
    let pro = min.ts(arg);
    pro.then(function (val) {
        console.log(val);
        min.min(arg);
    });
}
if (argsParsed.items)
    itemize(arg);
else if (argsParsed.css)
    css(arg);
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
