"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const yaml = require("js-yaml");
const findUp = require("find-up");
const sass = require("node-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const stripCssComments = require("strip-css-comments");
const path = require("path");
const fs = require("fs-extra");
const FileHound = require("filehound");
const logger = require('tracer').console();
const JavaScriptObfuscator = require("javascript-obfuscator");
const ts = __importStar(require("typescript"));
const Terser = require("terser");
class MinJS {
    ts(dir) {
        logger.info(dir);
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            const rec = FileHound.create()
                .paths(dir)
                .ext("ts")
                .findSync();
            if (rec.length < 1)
                resolve('OK');
            THIZ.compile(rec, {
                target: ts.ScriptTarget.ES5,
                removeComments: true,
                allowJs: true,
                skipLibCheck: true,
                allowSyntheticDefaultImports: true,
                lib: [
                    'lib.scripthost.d.ts', 'lib.dom.d.ts', 'lib.es5.d.ts', 'lib.es2015.promise.d.ts'
                ]
            });
            resolve('OK');
        });
    }
    min(dir) {
        const THIZ = this;
        return new Promise(async function (resolve, reject) {
            const rec = FileHound.create()
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
            for (let fn of rec) {
                try {
                    await THIZ._minOneJS(fn);
                }
                catch (err) {
                    logger.warn(err);
                    reject(err);
                }
            }
            console.info('Done!'.green);
            resolve('OK');
        });
    }
    _minOneJS(fn) {
        return new Promise(async function (resolve, reject) {
            let result;
            try {
                logger.trace(fn);
                let code = fs.readFileSync(fn).toString('utf8');
                let optionsCompJS = Object.assign({}, MinJS.CompOptionsJS);
                let _output = { indent_level: 0, quote_style: 0, semicolons: false };
                optionsCompJS['output'] = _output;
                if (fn.includes('-custel'))
                    result = Terser.minify(code, MinJS.CompOptionsJS);
                else
                    result = Terser.minify(code, optionsCompJS);
                let txt = result.code;
                txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
                txt = txt.replace(/\n\s*\n/g, '\n');
                txt = txt.trim();
                if (fn.includes('-custel')) {
                    let ugs;
                    try {
                        logger.info('obs', fn);
                        ugs = JavaScriptObfuscator.obfuscate(txt, MinJS.getCompOptions());
                        txt = ugs.getObfuscatedCode();
                    }
                    catch (err) {
                        logger.error(fn, 'error');
                        logger.error(err);
                        reject(err);
                    }
                }
                txt = MinJS.ver + txt;
                let fn2 = fn.slice(0, -3);
                fn2 = fn2 + '.min.js';
                fs.writeFileSync(fn2, txt);
                resolve('OK');
            }
            catch (err) {
                logger.warn(fn, err, result);
                reject(err);
            }
        });
    }
    static getCompOptions() {
        let t = {
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
    }
    compile(fileNames, options_) {
        let program = ts.createProgram(fileNames, options_);
        let emitResult = program.emit();
        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);
        allDiagnostics.forEach(diagnostic => {
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                console.info(`${diagnostic.file.fileName}:`.cyan, `${line + 1}:${character + 1}`.yellow, `${message}`);
            }
            else {
                console.info(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
            }
        });
        let exitCode = emitResult.emitSkipped ? 1 : 0;
        console.info(`status code '${exitCode}'.`);
    }
}
exports.MinJS = MinJS;
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
class Sas {
    css(dir) {
        const THIZ = this;
        return new Promise(async function (resolve, reject) {
            let a;
            let fn = dir + '/style.yaml';
            if (fs.existsSync(fn))
                a = yaml.load(fs.readFileSync(fn));
            else {
                let dir2 = findUp.sync('style.yaml', { cwd: dir });
                a = yaml.load(fs.readFileSync(dir2));
                dir = dir2.slice(0, -12);
            }
            logger.info(dir);
            const css = a.css;
            const set = new Set(css);
            logger.info(set);
            for (let item of set) {
                await THIZ._trans(item, dir);
            }
            console.info();
            console.info(' Done!'.green);
            resolve('OK');
        });
    }
    _trans(fn2, dir) {
        let css = sass.renderSync({
            file: dir + '/' + fn2,
            outputStyle: 'compact'
        });
        postcss([autoprefixer])
            .process(css.css, { from: undefined }).then(function (result) {
            console.info('autoprefixer');
            result.warnings().forEach(function (warn) {
                console.warn(warn.toString());
            });
            let res = stripCssComments(result.css, { preserve: false });
            res = res.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
            res = res.replace(/\n\s*\n/g, '\n');
            res = res.trim();
            res = res.replace(/  /g, ' ');
            res = res.replace(/; /g, ';');
            res = res.replace(/: /g, ':');
            res = res.replace(/ }/g, '}');
            res = res.replace(/ { /g, '{');
            res = res.replace(/, /g, ',');
            const ver = ' /* mB ' + Base_1.Ver.ver() + ' on ' + Base_1.Ver.date() + " */";
            res = res + ver;
            let filename2 = path.basename(fn2);
            filename2 = filename2.split('.').slice(0, -1).join('.');
            let filename = filename2.split('\\').pop().split('/').pop();
            fs.ensureDirSync(dir + '/css');
            fs.writeFileSync(dir + '/css/' + filename + '.css', res);
        });
    }
}
exports.Sas = Sas;
module.exports = {
    Sas, MinJS
};
