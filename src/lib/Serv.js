"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const serveStatic = require('serve-static');
const URL = require('url');
const logger = require('tracer').console();
class CustomCors {
    constructor(validOrigins) {
        return (request, response, next) => {
            const origin = request.get('origin');
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
        logger.trace(original);
        let origin = proto + '://' + host;
        return origin;
    }
}
exports.CustomCors = CustomCors;
class BaseRPCMethodHandler {
    ret(resp, result, broT, cdnT) {
        if (!broT)
            broT = 0;
        if (!cdnT)
            cdnT = 0;
        const ret = {};
        ret.result = result;
        resp.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
        resp.setHeader('X-intu-ts', Date.now());
        resp.json(ret);
    }
    retErr(resp, msg, broT, cdnT) {
        if (!broT)
            broT = 2;
        if (!cdnT)
            cdnT = 1;
        logger.warn(msg);
        const ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
        resp.setHeader('X-intu-ts', Date.now());
        resp.json(ret);
    }
    handleRPC(req, resp) {
        if (!this)
            throw new Error('bind of class instance needed');
        const THIZ = this;
        let method;
        let ent;
        let params;
        try {
            params = URL.parse(req.url, true).query;
            console.log(params);
            const user = params.user;
            const pswd = params.pswd;
            const token = params.token;
            method = params.method;
            ent = params.ent;
            THIZ[method](resp, params, ent, user, pswd, token);
        }
        catch (err) {
            logger.info(err);
            THIZ.retErr(resp, params, null, null);
        }
    }
}
exports.BaseRPCMethodHandler = BaseRPCMethodHandler;
class ExpressRPC {
    get appInst() { return ExpressRPC._appInst; }
    makeInstance(origins) {
        if (ExpressRPC._appInst)
            throw new Error('one instance of express app already exists');
        console.log('Allowed >>> ', origins);
        const cors = new CustomCors(origins);
        ExpressRPC._appInst = express();
        ExpressRPC._appInst.set('trust proxy', true);
        this.appInst.use(cors);
        this.appInst.use(bodyParser.urlencoded({ extended: false }));
        this.appInst.use(formidable());
    }
    routeRPC(route, pgOrScreen, foo) {
        if (pgOrScreen.length < 1)
            throw new Error('Each RPC should have the named page or screen argument');
        const r = '/' + route;
        this.appInst.get(r, foo);
    }
    handleLog(foo) {
        this.routeRPC('log', 'log', (req, res) => {
            const params = URL.parse(req.url, true).query;
            const method = params.method;
            if ('log' == method) {
                params['ip'] = req.ip;
                params['date'] = Date.now();
                foo(params);
                const resp = {};
                ExpressRPC.logHandler.ret(res, resp, 2, 1);
            }
            else {
                const resp = {};
                resp.errorMessage = 'mismatch';
                ExpressRPC.logHandler.retErr(res, resp, 2, 1);
            }
        });
    }
    serveStatic(path, broT, cdnT) {
        if (!broT)
            broT = 30 * 60;
        if (!cdnT)
            cdnT = (30 * 60) - 1;
        logger.trace('Serving root:', path, broT, cdnT);
        this.appInst.use((req, res, next) => {
            if (req.path.endsWith('.ts') || req.path.endsWith('.pug')) {
                res.status(403).send('forbidden');
            }
            else
                next();
        });
        this.appInst.use(serveStatic(path, {
            setHeaders: function (res, path) {
                if (serveStatic.mime.lookup(path) === 'text/html') { }
                res.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
                if (path.endsWith('.yaml') || path.endsWith('.json')) {
                    res.setHeader('Cache-Control', 'public, max-age=' + 300 + ', s-max-age=' + 299);
                }
                res.setHeader('X-intu-ts', Date.now());
            }
        }));
    }
    listen(port) {
        this.appInst.listen(port, () => {
            console.info('server running on port:', port);
        });
    }
}
exports.ExpressRPC = ExpressRPC;
ExpressRPC.logHandler = new BaseRPCMethodHandler();
module.exports = {
    ExpressRPC, BaseRPCMethodHandler
};
