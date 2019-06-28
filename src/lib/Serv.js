"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
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
        this.appInst.use(cors);
        this.appInst.use(bodyParser.urlencoded({ extended: false }));
        this.appInst.use(formidable());
    }
    handleRRoute(route, pgOrScreen, foo) {
        const r = '/' + route + '/' + pgOrScreen;
        this.appInst.post(r, foo);
    }
    serveStatic(path) {
        this.appInst.use(express.static(path));
    }
    listen(port) {
        this.appInst.listen(port, () => {
            console.info('server running on port:', port);
        });
    }
}
exports.ExpressRPC = ExpressRPC;
module.exports = {
    ExpressRPC
};
