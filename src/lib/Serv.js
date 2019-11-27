"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const serveStatic = require('serve-static');
const lz = require('lz-string');
const URL = require('url');
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "Serv" });
class CustomCors {
    constructor(validOrigins) {
        return (request, response, next) => {
            const origin = request.get('origin');
            const origin2 = request.headers.origin;
            log.info(origin, origin2);
            if (!origin) {
                return next();
            }
            let approved = false;
            validOrigins.forEach(function (ori) {
                if (ori == '*')
                    approved = true;
                if (origin.includes(ori))
                    approved = true;
            });
            if (approved) {
                response.setHeader('Access-Control-Allow-Origin', origin);
                return next();
            }
            response.status(403).end();
        };
    }
    static getReqAsOrigin(req) {
        let proto = req.connection.encrypted ? 'https' : 'http';
        const host = req.hostname;
        let original = req.originalUrl;
        log.info(original);
        let origin = proto + '://' + host;
        return origin;
    }
}
exports.CustomCors = CustomCors;
class BaseRPCMethodHandler {
    ret(resp, result, broT, cdnT) {
        if (!broT)
            broT = 1;
        if (!cdnT)
            cdnT = 1;
        const ret = {};
        ret.result = result;
        resp.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
        resp.setHeader('x-intu-ts', new Date().toISOString());
        let json = JSON.stringify(ret);
        resp.status(200).send(lz.compress(json));
    }
    retErr(resp, msg, broT, cdnT) {
        if (!broT)
            broT = 1;
        if (!cdnT)
            cdnT = 1;
        if ((!msg) || msg.length < 1)
            throw new Error('no message');
        log.warn(msg);
        const ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
        resp.setHeader('x-intu-ts', new Date().toISOString());
        let json = JSON.stringify(ret);
        resp.status(200).send(lz.compress(json));
    }
    handleRPC(req, resp) {
        if (!this)
            throw new Error('bind of class instance needed');
        const THIZ = this;
        let method;
        let qstr;
        try {
            qstr = URL.parse(req.url, true).query;
            let compressed = qstr['p'];
            let str = lz.decompressFromEncodedURIComponent(compressed);
            const params = JSON.parse(str);
            method = params.method;
            if (typeof THIZ[method] != 'function') {
                this.retErr(resp, 'no such method ' + method);
                return;
            }
            THIZ[method](resp, params);
        }
        catch (err) {
            log.info(err);
            THIZ.retErr(resp, qstr, null, null);
        }
    }
}
exports.BaseRPCMethodHandler = BaseRPCMethodHandler;
class LogHandler extends BaseRPCMethodHandler {
    constructor(foo) {
        super();
        this._foo = foo;
    }
    async log(resp, params) {
        await this._foo(params);
        let json = JSON.stringify('logged');
        resp.status(200).send(lz.compress(json));
    }
}
class Serv {
    constructor(origins) {
        this._origins = origins;
        if (Serv._expInst)
            throw new Error('one instance of express app already exists');
        log.info('Allowed >>> ', origins);
        const cors = new CustomCors(origins);
        Serv._expInst = express();
        Serv._expInst.use(cors);
    }
    setLogger(foo) {
        this.routeRPC('log', new LogHandler(foo));
    }
    routeRPC(route, handler) {
        const r = '/' + route;
        Serv._expInst.get(r, handler.handleRPC.bind(handler));
    }
    serveStatic(path, broT, cdnT) {
        if (!broT)
            broT = 30 * 60;
        if (!cdnT)
            cdnT = (30 * 60) - 1;
        log.info('Serving root:', path, broT, cdnT);
        Serv._expInst.use((req, res, next) => {
            if (req.path.endsWith('.ts') || req.path.endsWith('.pug')) {
                res.status(403).send('forbidden');
            }
            else
                next();
        });
        Serv._expInst.use(serveStatic(path, {
            setHeaders: function (res, path) {
                if (serveStatic.mime.lookup(path) === 'text/html') { }
                res.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
                if (path.endsWith('.yaml') || path.endsWith('.json')) {
                    res.setHeader('Cache-Control', 'public, max-age=' + 300 + ', s-max-age=' + 299);
                }
                res.setHeader('x-intu-ts', new Date().toISOString());
            }
        }));
    }
    listen(port) {
        Serv._expInst.listen(port, () => {
            log.info('services running on port:', port);
        });
    }
}
exports.Serv = Serv;
module.exports = {
    Serv, BaseRPCMethodHandler
};
