#!/usr/bin/env node

declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

import { Dirs, Bake, Items, Tag } from 'nBake/lib/Base'
import { Srv, Watch, Dev } from './lib/ABase'

const os = require('os')
const download = require('image-downloader') // for url
const logger = require('tracer').console()





// /////////////////////////////////////////////////////////////////


const wa = new Watch(config)
wa.start()

const de = new Dev(config)
de.srv()
