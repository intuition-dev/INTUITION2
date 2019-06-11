"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ver = (function () {
    function Ver() {
    }
    Ver.ver = function () {
        return 'v6.06.07';
    };
    Ver.date = function () {
        return new Date().toISOString();
    };
    return Ver;
}());
exports.Ver = Ver;
var colors = require("colors");
var logger = require('tracer').colorConsole({
    filters: [
        {
            warn: colors.yellow,
            error: [colors.red]
        }
    ]
});
var Extra_1 = require("./Extra");
var FileOpsBase_1 = require("./FileOpsBase");
var Marpit = require("@marp-team/marpit");
var marpit = new Marpit.Marpit();
var fs = require("fs-extra");
var FileHound = require("filehound");
var yaml = require("js-yaml");
var findUp = require("find-up");
var riotc = require("riot-compiler");
var pug = require("pug");
var minify = require('html-minifier').minify;
var Terser = require("terser");
var beeper = require("beeper");
var JavaScriptObfuscator = require("javascript-obfuscator");
var markdownItCont = require("markdown-it-container");
var md = require('markdown-it')({
    html: true,
    typographer: true,
    linkify: true
});
md.use(markdownItCont, 'dynamic', {
    validate: function () { return true; },
    render: function (tokens, idx) {
        var token = tokens[idx];
        if (token.nesting === 1) {
            return '\n<div class="' + token.info.trim() + '">';
        }
        else {
            return '</div>\n';
        }
    }
});
var MBake = (function () {
    function MBake() {
    }
    MBake.prototype.bake = function (path_, prod) {
        return new Promise(function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                console.info('no path_ arg passed');
                reject('no path_ arg passed');
            }
            try {
                console.info(' Baking ' + path_);
                var d = new FileOpsBase_1.Dirs(path_);
                var dirs = d.getFolders();
                if (!dirs || dirs.length < 1) {
                    path_ = FileOpsBase_1.Dirs.goUpOne(path_);
                    console.info(' New Dir: ', path_);
                    d = new FileOpsBase_1.Dirs(path_);
                    dirs = d.getFolders();
                }
                for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
                    var val = dirs_1[_i];
                    var n = new BakeWrk(val);
                    n.bake(prod);
                }
                resolve('OK');
            }
            catch (err) {
                logger.info(err);
                reject(err);
            }
        });
    };
    MBake.prototype.compsNBake = function (path_, prod) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var t, lst, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!path_ || path_.length < 1) {
                                console.info('no path_ arg passed');
                                reject("no path args passed");
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            console.info(' Xomp ' + path_);
                            t = new Comps(path_);
                            lst = t.get();
                            return [4, t.comps(lst)];
                        case 2:
                            _a.sent();
                            _this.bake(path_, prod)
                                .then(function () {
                                resolve('OK');
                            })
                                .catch(function (err) {
                                logger.info(err);
                                reject(err);
                            });
                            return [3, 4];
                        case 3:
                            err_1 = _a.sent();
                            logger.info(err_1);
                            reject(err_1);
                            return [3, 4];
                        case 4: return [2];
                    }
                });
            });
        });
    };
    MBake.prototype.clearToProd = function (path_) {
        return new Promise(function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                console.info('no path_ arg passed');
                reject(('no path_ arg passed'));
            }
            try {
                console.info(' Clearing ' + path_);
                var dir = FileOpsBase_1.Dirs.slash(path_);
                var rec = FileHound.create()
                    .paths(dir)
                    .ext(['pug', 'yaml', 'js', 'ts', 'scss'])
                    .findSync();
                rec.forEach(function (file) {
                    var min = file.split('.')[file.split('.').length - 2] === 'min';
                    if (!min) {
                        console.info(' Removing ' + file);
                        fs.removeSync(file);
                    }
                });
            }
            catch (err) {
                logger.warn(err);
                reject(err);
            }
            resolve('OK');
        });
    };
    MBake.prototype.itemizeNBake = function (ppath_, prod) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ppath_ || ppath_.length < 1) {
                console.info('no path_ arg passed');
                reject('no path arg passed');
            }
            logger.info('ib:', ppath_);
            try {
                var i = new Items(ppath_);
                i.itemize();
            }
            catch (err) {
                logger.info(err);
                reject(err);
            }
            _this.bake(ppath_, prod)
                .then(function () { resolve('OK'); })
                .catch(function (err) {
                logger.info(err);
                reject(err);
            });
        });
    };
    return MBake;
}());
exports.MBake = MBake;
var BakeWrk = (function () {
    function BakeWrk(dir_) {
        var dir = FileOpsBase_1.Dirs.slash(dir_);
        this.dir = dir;
        console.info(' processing: ' + this.dir);
    }
    BakeWrk.metaMD = function (text, options) {
        console.info(' ', options);
        return md.render(text);
    };
    BakeWrk.marp = function (text, options) {
        console.info(' ', options);
        var _a = marpit.render(text), html = _a.html, css = _a.css;
        return html;
    };
    BakeWrk.minify_pg = function (text, inline) {
        var code = text.match(/^\s*\s*$/) ? '' : text;
        var optionsCompH = Object.assign({}, Extra_1.MinJS.CompOptionsJS);
        var _output = { indent_level: 0, quote_style: 3, semicolons: false };
        optionsCompH['output'] = _output;
        var result = Terser.minify(code, optionsCompH);
        if (result.error) {
            console.info('Terser error:', result.error);
            beeper();
            return text;
        }
        return result.code.replace(/;$/, '');
    };
    BakeWrk.sindexes = function (source, f) {
        if (!source)
            return [];
        if (!f)
            return [];
        var result = [];
        for (var i = 0; i < source.length; ++i) {
            if (source.substring(i, i + f.length) == f)
                result.push(i);
        }
        return result;
    };
    BakeWrk.prototype.bake = function (prod) {
        var tstFile = this.dir + '/index.pug';
        if (!fs.existsSync(tstFile)) {
            return;
        }
        process.chdir(this.dir);
        var dat = new FileOpsBase_1.Dat(this.dir);
        var options = dat.getAll();
        options['filters'] = {
            metaMD: BakeWrk.metaMD,
            marp: BakeWrk.marp
        };
        options['ENV'] = prod;
        if (this.locAll(options))
            return ' ';
        this.writeFilePg(this.dir + '/index.pug', options, this.dir + '/index.html');
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', options, this.dir + '/m.html');
    };
    BakeWrk.prototype.locAll = function (options) {
        if (!options.LOC)
            return false;
        var d = options.LOC;
        d = this.dir + d;
        var a;
        var fn = d + '/loc.yaml';
        if (fs.existsSync(fn))
            a = yaml.load(fs.readFileSync(fn));
        else {
            var dir2 = findUp.sync('loc.yaml', { cwd: d });
            a = yaml.load(fs.readFileSync(dir2));
            d = dir2.slice(0, -8);
        }
        var css = a.loc;
        var set = new Set(css);
        logger.info(set);
        var merged = __assign({}, a, options);
        for (var _i = 0, set_1 = set; _i < set_1.length; _i++) {
            var item = set_1[_i];
            this.do1Locale(item, merged);
        }
        fs.remove(this.dir + '/index.html');
    };
    BakeWrk.prototype.do1Locale = function (locale, combOptions) {
        console.log(locale);
        var localeProps = {};
        localeProps['LOCALE'] = locale;
        for (var key in combOptions)
            if (key.endsWith('-' + locale)) {
                var len = key.length - ('-' + locale).length;
                var key2 = key.substring(0, len);
                localeProps[key2] = combOptions[key];
            }
        var locMerged = __assign({}, combOptions, localeProps);
        console.log(localeProps);
        var locDir = this.dir + '/' + locale;
        console.log(locDir);
        fs.ensureDirSync(locDir);
        if (fs.existsSync(locDir + '/loc.pug'))
            this.writeFilePg(locDir + '/loc.pug', locMerged, locDir + '/index.html');
        else
            this.writeFilePg(this.dir + '/index.pug', locMerged, locDir + '/index.html');
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', locMerged, locDir + '/m.html');
    };
    BakeWrk.prototype.writeFilePg = function (source, options, target) {
        var html = pug.renderFile(source, options);
        var ver = '<!-- mB ' + Ver.ver() + ' on ' + Ver.date() + ' -->';
        if (!options['pretty'])
            html = minify(html, BakeWrk.minifyPg);
        html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml);
        fs.writeFileSync(target, html);
    };
    BakeWrk.ebodyHtml = '</body>';
    BakeWrk.minifyPg = {
        caseSensitive: true,
        collapseWhitespace: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: BakeWrk.minify_pg,
        quoteCharacter: "'",
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        sortAttributes: true,
        sortClassName: true
    };
    return BakeWrk;
}());
exports.BakeWrk = BakeWrk;
var Items = (function () {
    function Items(dir_) {
        var dir = FileOpsBase_1.Dirs.slash(dir_);
        var fn = dir + '/dat_i.yaml';
        if (!fs.existsSync(fn)) {
            var dir2 = findUp.sync('dat_i.yaml', { cwd: dir });
            if (dir2 != null) {
                dir = dir2.slice(0, -11);
            }
        }
        this.dir = dir;
        var d = new FileOpsBase_1.Dirs(dir);
        this.dirs = d.getFolders();
    }
    Items.prototype._addAnItem = function (dn) {
        try {
            if (!fs.existsSync(dn + '/dat.yaml'))
                return;
            var y = yaml.load(fs.readFileSync(dn + '/dat.yaml'));
            if (!y)
                return;
            if (false == y.publish) {
                return;
            }
            if (typeof y.publishDate !== 'undefined'
                && y.publishDate !== null
                && (y.publishDate - Date.now()) > 0) {
                return;
            }
            Items.clean(y);
            var dl = dn.lastIndexOf('/');
            var url = dn.substring(dl + 1);
            console.info('', url);
            y.url = url;
            if (!y.hasOwnProperty('id'))
                y.id = url;
            if (!this.feed.items)
                this.feed.items = [];
            y.index = this.feed.items.length;
            this.feed.items.push(y);
        }
        catch (err) {
            logger.info(err);
        }
    };
    Items.prototype.itemize = function () {
        logger.info('Itemizing: ' + this.dir);
        var rootDir = this.dir;
        var fn = rootDir + '/dat_i.yaml';
        if (!fs.existsSync(fn))
            return;
        var y = yaml.load(fs.readFileSync((fn)));
        Items.clean(y);
        y.mbVer = Ver.ver();
        this.feed = y;
        logger.warn(this.feed);
        for (var _i = 0, _a = this.dirs; _i < _a.length; _i++) {
            var val = _a[_i];
            this._addAnItem(val);
        }
        if (!this.feed.items)
            this.feed.items = [];
        if (0 == this.feed.items.length) {
            logger.info('no items');
            return;
        }
        this.feed.count = this.feed.items.length;
        var json = JSON.stringify(this.feed, null, 2);
        var items = rootDir + '/items.json';
        fs.writeFileSync(items, json);
        console.info(' processed.');
        return ' processed ';
    };
    Items.clean = function (o) {
        delete o['basedir'];
        delete o['ROOT'];
        delete o['pretty'];
        delete o['LOC'];
        delete o['publishFlag'];
    };
    return Items;
}());
exports.Items = Items;
var Comps = (function () {
    function Comps(dir_) {
        this.ver = '// mB ' + Ver.ver() + ' on ' + Ver.date() + '\r\n';
        var dir = FileOpsBase_1.Dirs.slash(dir_);
        this.dir = dir;
    }
    Comps.prototype.get = function () {
        var rec = FileHound.create()
            .paths(this.dir)
            .ext('pug')
            .glob('*-comp.pug')
            .findSync();
        var ret = [];
        for (var _i = 0, rec_1 = rec; _i < rec_1.length; _i++) {
            var val = rec_1[_i];
            val = val.split('\\').join('/');
            ret.push(val);
        }
        return ret;
    };
    Comps.prototype.comps = function (list) {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, list_1, val, s, n, dir, name_1, p;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.info('Looking for comps: *-comp ' + THIZ.dir);
                            _i = 0, list_1 = list;
                            _a.label = 1;
                        case 1:
                            if (!(_i < list_1.length)) return [3, 4];
                            val = list_1[_i];
                            s = fs.readFileSync(val).toString();
                            n = val.lastIndexOf('/');
                            dir = val.substring(0, n);
                            name_1 = val.substring(n);
                            p = name_1.lastIndexOf('.');
                            name_1 = name_1.substring(0, p);
                            console.info(' ' + dir + name_1);
                            return [4, THIZ.process(s, dir, dir + name_1)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4:
                            resolve('OK');
                            return [2];
                    }
                });
            });
        });
    };
    Comps.prototype.process = function (s, dir, fn) {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            var r_options = { 'template': 'pug', 'basedir': dir };
            logger.info('compiling', fn);
            var js1;
            try {
                js1 = riotc.compile(s, r_options, fn);
            }
            catch (err) {
                beeper(1);
                logger.error('compiler error');
                logger.error(err);
                reject(err);
            }
            fs.writeFileSync(fn + '.js', js1);
            var optionsCompR = Object.assign({}, Extra_1.MinJS.CompOptionsJS);
            var _output = { indent_level: 0, quote_style: 0, semicolons: false };
            optionsCompR['output'] = _output;
            var js2 = Terser.minify(js1, optionsCompR);
            var ugs;
            try {
                logger.info('obs');
                ugs = JavaScriptObfuscator.obfuscate(js2.code, Extra_1.MinJS.getCompOptions());
            }
            catch (err) {
                logger.error('error');
                logger.error(err);
                reject(err);
            }
            var obCode = THIZ.ver + ugs.getObfuscatedCode();
            fs.writeFileSync(fn + '.min.js', obCode);
            resolve('OK');
        });
    };
    return Comps;
}());
exports.Comps = Comps;
module.exports = {
    BakeWrk: BakeWrk, Items: Items, Comps: Comps, Ver: Ver, MBake: MBake
};
