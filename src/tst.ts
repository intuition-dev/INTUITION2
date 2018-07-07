#!/usr/bin/env node

declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

import { Dirs, Bake, Items, Tag, nBake } from 'nBake/lib/Base'
import { Srv, Watch, Dev } from './lib/ABase'

const os = require('os')
const download = require('image-downloader') // for url
const logger = require('tracer').console()

let b = new nBake()
console.log(b.ver())
// /////////////////////////////////////////////////////////////////////////////////////



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


const srv = new Srv(bake, itemize, tags, config)
srv.apiSetup()
srv.start()

const wa = new Watch(config)
wa.start()

const de = new Dev(config)
de.srv()
