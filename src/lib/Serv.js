"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const logger = require('tracer').console();
const fs = require("fs");
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
            logger.trace(origin, approved);
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
    serveStatic(path) {
        console.log('_____________');
        console.log('Serving root:');
        fs.readdirSync(path).forEach(file => {
            console.log(file);
        });
        this.appInst.use(express.static(path));
    }
    listen(port) {
        this.appInst.listen(port, () => {
            console.info('server running on port:', port);
        });
    }
}
exports.ExpressRPC = ExpressRPC;
class BasePgRouter {
    ret(resp, result) {
        const ret = {};
        ret.result = result;
        resp.json(ret);
    }
    retErr(resp, msg) {
        logger.warn(msg);
        const ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.json(ret);
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
            logger.info(method);
            THIZ[method](resp, params, user, pswd);
        }
        catch (err) {
            logger.info(err);
            THIZ.retErr(resp, method);
        }
    }
}
exports.BasePgRouter = BasePgRouter;
module.exports = {
    ExpressRPC, BasePgRouter
};
