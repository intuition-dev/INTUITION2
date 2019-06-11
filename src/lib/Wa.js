"use strict";
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
var Base_1 = require("./Base");
var Extra_1 = require("./Extra");
var FileOpsBase_1 = require("./FileOpsBase");
var express = require("express");
var chokidar = require("chokidar");
var reload = require("reload");
var cheerio = require("cheerio");
var interceptor = require("express-interceptor");
var logger = require('tracer').console();
var opn = require("open");
var Wa = (function () {
    function Wa() {
    }
    Wa.watch = function (dir, port, reloadPort) {
        port = port || 8090;
        var ss = new MDevSrv(dir, port, reloadPort);
        var mp = new MetaPro(dir);
        var ww = new Watch(mp, dir);
        ww.start(450);
        console.info(' Serving on ' + 'http://localhost:' + port);
        console.info(' --------------------------');
        console.info('');
        opn('http://localhost:' + port);
    };
    return Wa;
}());
exports.Wa = Wa;
var Watch = (function () {
    function Watch(mp_, mount) {
        this.mp = mp_;
        if (mount.endsWith('/.')) {
            mount = mount.slice(0, -1);
        }
        this.root = mount;
    }
    Watch.prototype.start = function (delay_) {
        this.delay = delay_;
        console.info(' watcher starting');
        console.info(this.root);
        var watchList = [];
        watchList.push(this.root + '/**/*.md');
        watchList.push(this.root + '/**/*.ts');
        watchList.push(this.root + '/**/*.pug');
        watchList.push(this.root + '/**/*.scss');
        watchList.push(this.root + '/**/*.sass');
        watchList.push(this.root + '/**/*.yaml');
        watchList.push(this.root + '/**/*.js');
        watchList.push(this.root + '/**/*.json');
        logger.trace(watchList);
        this.watcher = chokidar.watch(watchList, {
            ignoreInitial: true,
            cwd: this.root,
            usePolling: true,
            useFsEvents: false,
            binaryInterval: delay_ * 5,
            interval: delay_,
            atomic: delay_,
            awaitWriteFinish: {
                stabilityThreshold: delay_ * 1.2,
                pollInterval: delay_ * .5
            }
        });
        var thiz = this;
        this.watcher.on('add', function (path) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, thiz.autoNT(path, 'a')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        this.watcher.on('change', function (path) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, thiz.autoNT(path, 'c')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
    };
    Watch.prototype.refreshBro = function () {
        MDevSrv.reloadServer.reload();
    };
    Watch.prototype.autoNT = function (path_, wa) {
        return __awaiter(this, void 0, void 0, function () {
            var path, p, folder, fn, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(wa);
                        path = FileOpsBase_1.Dirs.slash(path_);
                        p = path.lastIndexOf('/');
                        folder = '';
                        fn = path;
                        if (p > 0) {
                            folder = path.substring(0, p);
                            fn = path.substr(p + 1);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        logger.info('WATCHED1:', folder + '/' + fn);
                        return [4, this.mp.autoBake(folder, fn)];
                    case 2:
                        _a.sent();
                        return [4, this.refreshBro()];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_1 = _a.sent();
                        logger.warn(err_1);
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    return Watch;
}());
exports.Watch = Watch;
var MetaPro = (function () {
    function MetaPro(mount) {
        this.b = new Base_1.MBake();
        this.mount = mount;
        logger.info('MetaPro', this.mount);
    }
    MetaPro.prototype.bake = function (dir) {
        var folder = this.mount + '/' + dir;
        logger.info(folder);
        return this.b.bake(folder, 0);
    };
    MetaPro.prototype.comps = function (dir) {
        var folder = this.mount + '/' + dir;
        logger.info(folder);
        return this.b.compsNBake(folder, 0);
    };
    MetaPro.prototype.itemize = function (dir) {
        return this.b.itemizeNBake(this.mount + '/' + dir, 0);
    };
    MetaPro.prototype.css = function (dir) {
        return new Extra_1.Sas().css(this.mount + '/' + dir);
    };
    MetaPro.prototype.ts = function (dir) {
        var folder = this.mount + '/' + dir;
        var js = new Extra_1.MinJS();
        return js.ts(folder);
    };
    MetaPro.prototype.autoBake = function (folder__, file) {
        return __awaiter(this, void 0, void 0, function () {
            var folder, ext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folder = FileOpsBase_1.Dirs.slash(folder__);
                        ext = file.split('.').pop();
                        logger.info('WATCHED2:', folder, ext);
                        if (!(ext == 'scss' || ext == 'sass')) return [3, 2];
                        return [4, this.css(folder)];
                    case 1: return [2, _a.sent()];
                    case 2:
                        if (!(ext == 'ts')) return [3, 4];
                        return [4, this.ts(folder)];
                    case 3: return [2, _a.sent()];
                    case 4:
                        if (!(ext == 'yaml')) return [3, 6];
                        return [4, this.itemize(folder)];
                    case 5: return [2, _a.sent()];
                    case 6:
                        if (!(ext == 'md')) return [3, 8];
                        return [4, this.bake(folder)];
                    case 7: return [2, _a.sent()];
                    case 8:
                        if (!(ext == 'pug')) return [3, 12];
                        if (!(file.indexOf('-comp') >= 0)) return [3, 10];
                        return [4, this.comps(folder)];
                    case 9: return [2, _a.sent()];
                    case 10: return [4, this.bake(folder)];
                    case 11: return [2, _a.sent()];
                    case 12: return [2, ('Cant process ' + ext)];
                }
            });
        });
    };
    MetaPro.folderProp = 'folder';
    MetaPro.srcProp = 'src';
    MetaPro.destProp = 'dest';
    return MetaPro;
}());
exports.MetaPro = MetaPro;
var MDevSrv = (function () {
    function MDevSrv(dir, port, reloadPort) {
        var app = express();
        logger.info(dir, port);
        app.set('app port', port);
        var rport = Number(reloadPort) || 9856;
        reload(app, { verbose: false, port: rport })
            .then(function (reloadServer_) {
            MDevSrv.reloadServer = reloadServer_;
            logger.info('reloadServer');
        }).catch(function (e) {
            console.log('==================e', e);
        });
        app.set('views', dir);
        var bodyInterceptor = interceptor(function (req, res) {
            return {
                isInterceptable: function () {
                    return /text\/html/.test(res.get('Content-Type'));
                },
                intercept: function (body, send) {
                    var $document = cheerio.load(body);
                    $document('body').prepend('<script src="/reload/reload.js"></script>');
                    send($document.html());
                }
            };
        });
        var timeInterceptor = interceptor(function (req, res) {
            return {
                isInterceptable: function () {
                    var js = /application\/javascript/.test(res.get('Content-Type'));
                    var cs = /text\/css/.test(res.get('Content-Type'));
                    var img = /image\/jpg/.test(res.get('Content-Type'));
                    return cs || js || img;
                },
                intercept: function (body, send) {
                    setTimeout(function () { send(body); }, Math.floor(Math.random() * 200) + 50);
                }
            };
        });
        app.use(bodyInterceptor);
        app.use(timeInterceptor);
        app.use(express.static(dir));
        app.listen(port, function () {
            logger.info('dev srv ' + port);
        });
    }
    return MDevSrv;
}());
exports.MDevSrv = MDevSrv;
module.exports = {
    Wa: Wa, MetaPro: MetaPro, Watch: Watch, MDevSrv: MDevSrv
};
