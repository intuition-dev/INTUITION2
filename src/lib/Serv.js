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
    routeRPC2(route, pgOrScreen, foo) {
        if (pgOrScreen.length < 1)
            throw new Error('Each RPC should have the named page or screen argument');
        const r = '/' + route;
        this.appInst.get(r, foo);
    }
    handleRRoute(route, pgOrScreen, foo) {
        if (pgOrScreen.length < 1)
            throw new Error('Each RPC should be called by a named page or screen');
        const r = '/' + route + '/' + pgOrScreen;
        this.appInst.post(r, foo);
    }
    handleLog(foo) {
        const r = '/log/log';
        this.appInst.post(r, function (req, resp) {
            let params = JSON.parse(req.fields.params);
            const user = req.fields.user;
            const msg = params.msg;
            delete params.msg;
            const ret = {};
            ret.result = 'Logged';
            resp.json(ret);
            params['ip'] = req.ip;
            params['date'] = new Date();
            setTimeout(function () {
                foo(msg, params, user, req);
            }, 1);
        });
    }
    serveStatic(path, broT, cdnT) {
        if (!broT)
            broT = 1800;
        if (!cdnT)
            cdnT = 1799;
        logger.trace('Serving root:', path, broT, cdnT);
        this.appInst.use((req, res, next) => {
            if (req.path.endsWith('.ts') || req.path.endsWith('.pug') || req.path.endsWith('dat.yaml')) {
                res.status(403).send('forbidden');
            }
            else
                next();
        });
        this.appInst.use(serveStatic(path, {
            setHeaders: function (res, path) {
                if (serveStatic.mime.lookup(path) === 'text/html') { }
                res.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
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
class BaseRPCMethodHandler {
    ret(resp, result, broT, cdnT) {
        if (!broT)
            broT = 3;
        if (!cdnT)
            cdnT = 2;
        const ret = {};
        ret.result = result;
        resp.setHeader('Cache-Control', 'public, max-age=' + broT + ', s-max-age=' + cdnT);
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
        resp.json(ret);
    }
    handleRPC2(req, resp) {
        if (!this)
            throw new Error('bind of class instance needed');
        const THIZ = this;
        let method;
        let ent;
        let params;
        try {
            params = URL.parse(req.url, true).query;
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
    route(req, resp) {
        if (!this)
            throw new Error('bind of class instance needed');
        const THIZ = this;
        let method;
        try {
            const user = req.fields.user;
            const pswd = req.fields.pswd;
            method = req.fields.method;
            const params = JSON.parse(req.fields.params);
            THIZ[method](resp, params, user, pswd);
        }
        catch (err) {
            logger.info(err);
            THIZ.retErr(resp, method, null, null);
        }
    }
}
exports.BaseRPCMethodHandler = BaseRPCMethodHandler;
module.exports = {
    ExpressRPC, BaseRPCMethodHandler
};
