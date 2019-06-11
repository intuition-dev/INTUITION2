"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileOpsBase_1 = require("./FileOpsBase");
var probe = require("probe-image-size");
var extractor = require("unfluff");
var axios_1 = require("axios");
var logger = require('tracer').console();
var sm = require("sitemap");
var traverse = require("traverse");
var lunr = require("lunr");
var yaml = require("js-yaml");
var fs = require("fs-extra");
var FileHound = require("filehound");
var Map = (function () {
    function Map(root) {
        if (!root || root.length < 1) {
            console.info('no path arg passed');
            return;
        }
        this._root = root;
    }
    Map.prototype.gen = function () {
        return new Promise(function (resolve, reject) {
            var m = yaml.load(fs.readFileSync(this._root + '/map.yaml'));
            var jmenu = JSON.stringify(m.menu, null, 2);
            fs.writeFileSync(this._root + '/menu.json', jmenu);
            this._sitemap = sm.createSitemap({
                hostname: m['host']
            });
            var leaves = traverse(m.menu).reduce(function (acc, x) {
                if (this.isLeaf)
                    acc.push(x);
                return acc;
            }, []);
            var itemsRoot = m['itemsRoot'];
            if (itemsRoot) {
                var d = new FileOpsBase_1.Dirs(this._root + itemsRoot);
                leaves = leaves.concat(d.getFolders());
            }
            var arrayLength = leaves.length;
            logger.info(arrayLength);
            for (var i = 0; i < arrayLength; i++) {
                try {
                    var path = leaves[i];
                    if (path.includes(this._root))
                        path = path.replace(this._root, '');
                    var fullPath = this._root + path;
                    var dat = new FileOpsBase_1.Dat(fullPath);
                    var props = dat.getAll();
                    logger.info(path);
                    var priority = props['priority'];
                    if (!priority)
                        priority = 0.3;
                    var image = props['image'];
                    if (!image) {
                        this._sitemap.add({
                            url: path,
                            changefreq: m['changefreq'],
                            priority: priority
                        });
                    }
                    else {
                        this._sitemap.add({
                            url: path,
                            changefreq: m['changefreq'],
                            priority: priority,
                            img: [{
                                    url: image,
                                    title: props['title'],
                                    caption: props['title']
                                }]
                        });
                    }
                }
                catch (err) {
                    logger.info(err);
                }
            }
            var thiz = this;
            this._sitemap.toXML(function (err, xml) {
                fs.writeFileSync(thiz._root + '/sitemap.xml', xml);
                console.info(' Sitemap ready');
                thiz._map(leaves);
            });
            resolve('OK');
        });
    };
    Map.prototype._map = function (leaves) {
        var documents = [];
        var arrayLength = leaves.length;
        for (var i = 0; i < arrayLength; i++) {
            try {
                var path = leaves[i];
                if (path.includes(this._root))
                    path = path.replace(this._root, '');
                var fullPath = this._root + path;
                var rec = FileHound.create()
                    .paths(fullPath)
                    .ext('md')
                    .findSync();
                var text = '';
                for (var _i = 0, rec_1 = rec; _i < rec_1.length; _i++) {
                    var val = rec_1[_i];
                    val = FileOpsBase_1.Dirs.slash(val);
                    console.info(val);
                    var txt1 = fs.readFileSync(val, "utf8");
                    text = text + ' ' + txt1;
                }
                var row = {
                    id: path,
                    body: text
                };
                documents.push(row);
            }
            catch (err) {
                logger.info(err);
            }
        }
        logger.info(documents.length);
        var idx = lunr(function () {
            this.ref('id');
            this.field('body');
            documents.forEach(function (doc) {
                this.add(doc);
            }, this);
        });
        var jidx = JSON.stringify(idx);
        fs.writeFileSync(this._root + '/FTS.idx', jidx);
        console.info(' Map generated menu.json, sitemap.xml and FTS.idx(json) index in ' + this._root);
    };
    return Map;
}());
exports.Map = Map;
var Scrape = (function () {
    function Scrape() {
        axios_1.default.defaults.responseType = 'document';
    }
    Scrape.prototype.s = function (url) {
        return new Promise(function (resolve, reject) {
            try {
                console.info(url);
                axios_1.default.get(url).then(function (response) {
                    var data = extractor.lazy(response.data);
                    var ret = new Object();
                    ret['title'] = data.softTitle();
                    ret['content_text'] = data.description();
                    ret['image'] = data.image();
                    ret['title'] = Scrape.alphaNumeric(ret['title']);
                    ret['content_text'] = Scrape.alphaNumeric(ret['content_text']);
                    resolve(ret);
                });
            }
            catch (err) {
                logger.warn(err);
                reject(err);
            }
        });
    };
    Scrape.__getImageSize = function (iurl_) {
        logger.info(iurl_);
        return probe(iurl_, { timeout: 3000 });
    };
    Scrape.alphaNumeric = function (str) {
        if (!str)
            return '';
        var alpha_numeric = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + ' ');
        var filterd_string = '';
        for (var i = 0; i < str.length; i++) {
            var char = str[i];
            var index = alpha_numeric.indexOf(char);
            if (index > -1) {
                filterd_string += alpha_numeric[index];
            }
        }
        return filterd_string;
    };
    return Scrape;
}());
exports.Scrape = Scrape;
module.exports = {
    Scrape: Scrape
};
