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
var yaml = require("js-yaml");
var findUp = require("find-up");
var sass = require("node-sass");
var autoprefixer = require("autoprefixer");
var postcss = require("postcss");
var stripCssComments = require("strip-css-comments");
var path = require("path");
var fs = require("fs-extra");
var FileHound = require("filehound");
var logger = require('tracer').console();
var JavaScriptObfuscator = require("javascript-obfuscator");
var ts = require("typescript");
var Terser = require("terser");
var MinJS = (function () {
    function MinJS() {
    }
    MinJS.prototype.ts = function (dir) {
        logger.info(dir);
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            var rec = FileHound.create()
                .paths(dir)
                .ext("ts")
                .findSync();
            if (rec.length < 1)
                resolve('OK');
            THIZ.compile(rec, {
                target: ts.ScriptTarget.ES5,
                removeComments: true
            });
            resolve('OK');
        });
    };
    MinJS.prototype.min = function (dir) {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var rec, _i, rec_1, fn, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rec = FileHound.create()
                                .paths(dir)
                                .ext("js")
                                .addFilter(function (fn) {
                                if (fn._pathname.endsWith('.min.js')) {
                                    return false;
                                }
                                if (fn._pathname.endsWith('-comp.js')) {
                                    return false;
                                }
                                return true;
                            })
                                .findSync();
                            _i = 0, rec_1 = rec;
                            _a.label = 1;
                        case 1:
                            if (!(_i < rec_1.length)) return [3, 6];
                            fn = rec_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4, THIZ._minOneJS(fn)];
                        case 3:
                            _a.sent();
                            return [3, 5];
                        case 4:
                            err_1 = _a.sent();
                            logger.warn(err_1);
                            reject(err_1);
                            return [3, 5];
                        case 5:
                            _i++;
                            return [3, 1];
                        case 6:
                            console.info('Done!'.green);
                            resolve('OK');
                            return [2];
                    }
                });
            });
        });
    };
    MinJS.prototype._minOneJS = function (fn) {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var result, code, optionsCompJS, _output, txt, ugs, fn2;
                return __generator(this, function (_a) {
                    try {
                        console.log(fn);
                        code = fs.readFileSync(fn).toString('utf8');
                        optionsCompJS = Object.assign({}, MinJS.CompOptionsJS);
                        _output = { indent_level: 0, quote_style: 0, semicolons: false };
                        optionsCompJS['output'] = _output;
                        if (fn.includes('-wcomp'))
                            result = Terser.minify(code, MinJS.CompOptionsJS);
                        else
                            result = Terser.minify(code, optionsCompJS);
                        txt = result.code;
                        txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
                        txt = txt.replace(/\n\s*\n/g, '\n');
                        txt = txt.trim();
                        if (fn.includes('-wcomp')) {
                            ugs = void 0;
                            try {
                                logger.info('obs');
                                ugs = JavaScriptObfuscator.obfuscate(txt, MinJS.getCompOptions());
                                txt = ugs.getObfuscatedCode();
                            }
                            catch (err) {
                                logger.error('error');
                                logger.error(err);
                                reject(err);
                            }
                        }
                        txt = MinJS.ver + txt;
                        fn2 = fn.slice(0, -3);
                        fn2 = fn2 + '.min.js';
                        fs.writeFileSync(fn2, txt);
                        resolve('OK');
                    }
                    catch (err) {
                        logger.warn(err, result);
                        reject(err);
                    }
                    return [2];
                });
            });
        });
    };
    MinJS.getCompOptions = function () {
        var t = {
            identifierNamesGenerator: 'hexadecimal',
            disableConsoleOutput: false,
            target: 'browser',
            stringArray: true,
            stringArrayThreshold: 1,
            stringArrayEncoding: 'rc4',
            selfDefending: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: .6,
            deadCodeInjection: false
        };
        return t;
    };
    MinJS.prototype.compile = function (fileNames, options_) {
        var program = ts.createProgram(fileNames, options_);
        var emitResult = program.emit();
        var allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);
        allDiagnostics.forEach(function (diagnostic) {
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                console.info((diagnostic.file.fileName + ":").cyan, (line + 1 + ":" + (character + 1)).yellow, "" + message);
            }
            else {
                console.info("" + ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
            }
        });
        var exitCode = emitResult.emitSkipped ? 1 : 0;
        console.info("status code '" + exitCode + "'.");
    };
    MinJS.ver = '// mB ' + Base_1.Ver.ver() + ' on ' + Base_1.Ver.date() + '\r\n';
    MinJS.CompOptionsJS = {
        parse: { html5_comments: false },
        compress: {
            drop_console: true,
            keep_fargs: true, reduce_funcs: false
        },
        output: { indent_level: 1, quote_style: 3, semicolons: false },
        ecma: 5,
        keep_classnames: true,
        keep_fnames: true
    };
    return MinJS;
}());
exports.MinJS = MinJS;
var Sas = (function () {
    function Sas() {
    }
    Sas.prototype.css = function (dir) {
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var a, fn, dir2, css, set, _i, set_1, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fn = dir + '/assets.yaml';
                            if (fs.existsSync(fn))
                                a = yaml.load(fs.readFileSync(fn));
                            else {
                                dir2 = findUp.sync('assets.yaml', { cwd: dir });
                                a = yaml.load(fs.readFileSync(dir2));
                                dir = dir2.slice(0, -12);
                            }
                            logger.info(dir);
                            css = a.css;
                            set = new Set(css);
                            logger.info(set);
                            _i = 0, set_1 = set;
                            _a.label = 1;
                        case 1:
                            if (!(_i < set_1.length)) return [3, 4];
                            item = set_1[_i];
                            return [4, THIZ._trans(item, dir)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4:
                            console.info();
                            console.info(' Done!'.green);
                            resolve('OK');
                            return [2];
                    }
                });
            });
        });
    };
    Sas.prototype._trans = function (fn2, dir) {
        var css = sass.renderSync({
            file: dir + '/' + fn2,
            outputStyle: 'compact'
        });
        postcss([autoprefixer({ browsers: ['> 0.5%', 'cover 99.5%', 'last 2 major versions', 'Firefox ESR', 'ios_saf >= 10', 'ie >= 11'] })]).process(css.css, { from: undefined }).then(function (result) {
            console.info('autoprefixer');
            result.warnings().forEach(function (warn) {
                console.warn(warn.toString());
            });
            var res = stripCssComments(result.css, { preserve: false });
            res = res.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
            res = res.replace(/\n\s*\n/g, '\n');
            res = res.trim();
            res = res.replace(/  /g, ' ');
            res = res.replace(/; /g, ';');
            res = res.replace(/: /g, ':');
            res = res.replace(/ }/g, '}');
            res = res.replace(/ { /g, '{');
            res = res.replace(/, /g, ',');
            var ver = ' /* mB ' + Base_1.Ver.ver() + ' on ' + Base_1.Ver.date() + " */";
            res = res + ver;
            var filename2 = path.basename(fn2);
            filename2 = filename2.split('.').slice(0, -1).join('.');
            var filename = filename2.split('\\').pop().split('/').pop();
            fs.ensureDirSync(dir + '/css');
            fs.writeFileSync(dir + '/css/' + filename + '.css', res);
        });
    };
    return Sas;
}());
exports.Sas = Sas;
module.exports = {
    Sas: Sas, MinJS: MinJS
};
