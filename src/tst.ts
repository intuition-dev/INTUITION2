#!/usr/bin/env node

declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

import { Dirs, Bake, Items, Tag, nBake } from 'nBake/lib/Base'
import { Srv, Watch, Dev } from './lib/ABase'

const os = require('os')
const fs = require('fs')
const download = require('image-downloader') // for url
const logger = require('tracer').console()
const yaml = require('js-yaml')

let b = new nBake()
console.log(b.ver())
// /////////////////////////////////////////////////////////////////////////////////////

function bake(dir) {
	let folder = config.mount + dir
	logger.trace(folder)

	const start = new Date()

	let d = new Dirs(folder)
	let dirs =d.get()
	let msg:string = ''
	for (let val of dirs) {
		let b = new Bake(val)
		let m = b.bake()
		msg = msg + m
	}
	return msg
}

function itemize(dir) {
	let folder = config.mount + dir
	logger.trace(folder)
	const start = new Date()

	const i = new Items(folder)
	let msg = i.itemize()
	return msg
}


function tags(dir) {
	let folder = config.mount + dir
	logger.trace(folder)
	const start = new Date()

	let t = new Tag(folder)
	let lst = t.get()
	let msg = t.bake(lst)
	return msg
}


// /////////////////////////////////////////////////////////////////
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
	{ name: 'admin',  type: String, defaultOption: true}
 ]

const argsParsed = commandLineArgs(optionDefinitions)
let arg:string = argsParsed.admin
arg = arg +'/admin.yaml'
console.log(arg)

let config = yaml.load(fs.readFileSync(arg))
console.log(config)

const srv = new Srv(bake, itemize, tags, config)
srv.apiSetup()
srv.start()

const wa = new Watch(config)
wa.start()

const de = new Dev(config)
de.srv()