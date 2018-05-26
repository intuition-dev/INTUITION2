#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("nbake/lib/Base");
const ABase_1 = require("meta-admin/lib/ABase");
class Example extends ABase_1.Srv {
}
const os = require('os');
const fs = require('fs');
const download = require('image-downloader');
const logger = require('tracer').console();
const yaml = require('js-yaml');
let b = new Base_1.NBake();
console.log(b.ver());
function bake(dir) {
    let folder = config.mount + dir;
    logger.trace(folder);
    const start = new Date();
    let d = new Base_1.Dirs(folder);
    let dirs = d.get();
    let msg = '';
    for (let val of dirs) {
        let b = new Base_1.Bake(val);
        let m = b.bake();
        msg = msg + m;
    }
    return msg;
}
function itemize(dir) {
    let folder = config.mount + dir;
    logger.trace(folder);
    const start = new Date();
    const i = new Base_1.Items(folder);
    let msg = i.itemize();
    return msg;
}
function tags(dir) {
    let folder = config.mount + dir;
    logger.trace(folder);
    const start = new Date();
    let t = new Base_1.Tag(folder);
    let lst = t.get();
    let msg = t.bake(lst);
    return msg;
}
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
    { name: 'admin', type: String, defaultOption: true }
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.admin;
arg = arg + '/admin.yaml';
console.log(arg);
let config = yaml.load(fs.readFileSync(arg));
console.log(config);
const srv = new ABase_1.Srv(bake, itemize, tags, config);
srv.apiSetup();
srv.start();
