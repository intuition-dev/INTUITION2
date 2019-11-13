"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ver {
    static ver() {
        return 'v6.11.2';
    }
    static date() {
        return new Date().toISOString();
    }
}
exports.Ver = Ver;
const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "Base" });
const path = require('path');
const Extra_1 = require("./Extra");
const FileOpsBase_1 = require("./FileOpsBase");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const findUp = require("find-up");
const pug = require("pug");
const minify = require('html-minifier').minify;
const Terser = require("terser");
const markdownItCont = require("markdown-it-container");
const mad = require('markdown-it')({
    html: true,
    typographer: true,
    linkify: true
}).use(require('markdown-it-imsize'));
mad.use(markdownItCont, 'dynamic', {
    validate: function () { return true; },
    render: function (tokens, idx) {
        let token = tokens[idx];
        if (token.nesting === 1) {
            return '\n<div class="' + token.info.trim() + '">';
        }
        else {
            return '</div>\n';
        }
    }
});
class MBake {
    bake(path_, prod) {
        return new Promise(function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                log.info('no path_ arg passed');
                reject('no path_ arg passed');
            }
            try {
                log.info(' Baking ' + path_);
                let d = new FileOpsBase_1.Dirs(path_);
                let dirs = d.getFolders();
                if (!dirs || dirs.length < 1) {
                    path_ = FileOpsBase_1.Dirs.goUpOne(path_);
                    log.info(' New Dir: ', path_);
                    d = new FileOpsBase_1.Dirs(path_);
                    dirs = d.getFolders();
                }
                for (let val of dirs) {
                    let n = new BakeWrk(val);
                    n.bake(prod);
                }
                resolve('OK');
            }
            catch (err) {
                log.info(err);
                reject(err);
            }
        });
    }
    itemizeNBake(ppath_, prod) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            if (!ppath_ || ppath_.length < 1) {
                log.info('no path_ arg passed');
                reject('no path arg passed');
            }
            log.info('ib:', ppath_);
            try {
                const i = new Items(ppath_);
                i.itemize();
            }
            catch (err) {
                log.info(err);
                reject(err);
            }
            _this.bake(ppath_, prod)
                .then(function () { resolve('OK'); })
                .catch(function (err) {
                log.info(err);
                reject(err);
            });
        });
    }
}
exports.MBake = MBake;
class BakeWrk {
    constructor(dir_) {
        let dir = FileOpsBase_1.Dirs.slash(dir_);
        this.dir = dir;
        log.info(' processing: ' + this.dir);
    }
    static metaMD(text, options) {
        log.info(' ', options);
        return mad.render(text);
    }
    static minify_pg(text, inline) {
        let code = text.match(/^\s*\s*$/) ? '' : text;
        let optionsCompH = Object.assign({}, Extra_1.MinJS.CompOptionsJS);
        let _output = { indent_level: 0, quote_style: 3, semicolons: false };
        optionsCompH['output'] = _output;
        let result = Terser.minify(code, optionsCompH);
        if (result.error) {
            log.info('Terser error:', result.error);
            return text;
        }
        return result.code.replace(/;$/, '');
    }
    static sindexes(source, f) {
        if (!source)
            return [];
        if (!f)
            return [];
        let result = [];
        for (let i = 0; i < source.length; ++i) {
            if (source.substring(i, i + f.length) == f)
                result.push(i);
        }
        return result;
    }
    bake(prod) {
        let tstFile = this.dir + '/index.pug';
        if (!fs.existsSync(tstFile)) {
            return;
        }
        process.chdir(this.dir);
        log.info(this.dir);
        let dat = new FileOpsBase_1.Dat(this.dir);
        let options = dat.getAll();
        options['filters'] = {
            metaMD: BakeWrk.metaMD,
        };
        options['ENV'] = prod;
        const global = options['GLO'];
        if (global) {
            const ps = this.dir + '/' + global;
            const p = path.normalize(ps + '/GLO.yaml');
            let glo = yaml.load(fs.readFileSync(p));
            options = Object.assign(glo, options);
        }
        if (this.locAll(options))
            return ' ';
        this.writeFilePg(this.dir + '/index.pug', options, this.dir + '/index.html');
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', options, this.dir + '/m.html');
    }
    locAll(options) {
        if (!options.LOC)
            return false;
        let d = options.LOC;
        d = this.dir + d;
        let a;
        let fn = d + '/loc.yaml';
        if (fs.existsSync(fn))
            a = yaml.load(fs.readFileSync(fn));
        else {
            let dir2 = findUp.sync('loc.yaml', { cwd: d });
            a = yaml.load(fs.readFileSync(dir2));
            d = dir2.slice(0, -8);
        }
        const css = a.loc;
        const set = new Set(css);
        log.info(set);
        let merged = { ...a, ...options };
        for (let item of set) {
            this.do1Locale(item, merged);
        }
        fs.remove(this.dir + '/index.html');
    }
    do1Locale(locale, combOptions) {
        log.info(locale);
        let localeProps = {};
        localeProps['LOCALE'] = locale;
        for (let key in combOptions)
            if (key.endsWith('-' + locale)) {
                let len = key.length - ('-' + locale).length;
                let key2 = key.substring(0, len);
                localeProps[key2] = combOptions[key];
            }
        let locMerged = { ...combOptions, ...localeProps };
        log.info(localeProps);
        let locDir = this.dir + '/' + locale;
        log.info(locDir);
        fs.ensureDirSync(locDir);
        if (fs.existsSync(locDir + '/loc.pug'))
            this.writeFilePg(locDir + '/loc.pug', locMerged, locDir + '/index.html');
        else
            this.writeFilePg(this.dir + '/index.pug', locMerged, locDir + '/index.html');
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', locMerged, locDir + '/m.html');
    }
    writeFilePg(source, options, target) {
        let html = pug.renderFile(source, options);
        const ver = '<!-- mB ' + Ver.ver() + ' on ' + Ver.date() + ' -->';
        if (!options['pretty'])
            html = minify(html, BakeWrk.minifyPg);
        html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml);
        fs.writeFileSync(target, html);
    }
}
exports.BakeWrk = BakeWrk;
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
class Items {
    constructor(dir_) {
        let dir = FileOpsBase_1.Dirs.slash(dir_);
        let fn = dir + '/dat_i.yaml';
        if (!fs.existsSync(fn)) {
            let dir2 = findUp.sync('dat_i.yaml', { cwd: dir });
            if (dir2 != null) {
                dir = dir2.slice(0, -11);
            }
        }
        this.dir = dir;
        let d = new FileOpsBase_1.Dirs(dir);
        this.dirs = d.getFolders();
    }
    _addAnItem(dn) {
        try {
            if (!fs.existsSync(dn + '/dat.yaml'))
                return;
            let y = yaml.load(fs.readFileSync(dn + '/dat.yaml'));
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
            let dl = dn.lastIndexOf('/');
            let url = dn.substring(dl + 1);
            log.info('', url);
            y.url = url;
            if (!y.hasOwnProperty('id'))
                y.id = url;
            if (!this.feed.items)
                this.feed.items = [];
            y.index = this.feed.items.length;
            this.feed.items.push(y);
        }
        catch (err) {
            log.info(err);
        }
    }
    itemize() {
        log.info('Itemizing: ' + this.dir);
        const rootDir = this.dir;
        let fn = rootDir + '/dat_i.yaml';
        if (!fs.existsSync(fn))
            return;
        let y = yaml.load(fs.readFileSync((fn)));
        Items.clean(y);
        y.mbVer = Ver.ver();
        this.feed = y;
        log.warn(this.feed);
        for (let val of this.dirs) {
            this._addAnItem(val);
        }
        if (!this.feed.items)
            this.feed.items = [];
        if (0 == this.feed.items.length) {
            log.info('no items');
            return;
        }
        this.feed.count = this.feed.items.length;
        let json = JSON.stringify(this.feed, null, 2);
        let items = rootDir + '/items.json';
        fs.writeFileSync(items, json);
        log.info(' processed.');
        return ' processed ';
    }
    static clean(o) {
        delete o['basedir'];
        delete o['ROOT'];
        delete o['pretty'];
        delete o['LOC'];
        delete o['frags'];
    }
}
exports.Items = Items;
module.exports = {
    BakeWrk, Items, Ver, MBake
};
