"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('express-formidable');
var logger = require('tracer').console();
var CustomCors = (function () {
    function CustomCors(validOrigins) {
        return function (request, response, next) {
            var origin = request.get('origin');
            if (!origin) {
                return next();
            }
            var approved = false;
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
    CustomCors.getReqAsOrigin = function (req) {
        var proto = req.connection.encrypted ? 'https' : 'http';
        var host = req.hostname;
        var original = req.originalUrl;
        logger.trace(original);
        var origin = proto + '://' + host;
        return origin;
    };
    return CustomCors;
}());
exports.CustomCors = CustomCors;
var ExpressRPC = (function () {
    function ExpressRPC() {
    }
    ExpressRPC.makeInstance = function (origins) {
        console.log('Allowed >>> ', origins);
        var cors = new CustomCors(origins);
        var appInst = express();
        appInst.use(cors);
        appInst.use(bodyParser.urlencoded({ extended: false }));
        appInst.use(formidable());
        return appInst;
    };
    ExpressRPC.serveStatic = function (path) {
        return express.static(path);
    };
    return ExpressRPC;
}());
exports.ExpressRPC = ExpressRPC;
var RPCBasicAuth = (function () {
    function RPCBasicAuth() {
    }
    RPCBasicAuth.prototype.auth = function (user, password) {
        var buffUser = new Buffer(user);
        user = buffUser.toString('base64');
        var buffPwd = new Buffer(password);
        password = buffPwd.toString('base64');
        return function (request, response, next) {
            if (typeof request.fields.user === 'undefined'
                || typeof request.fields.pswd === 'undefined') {
                console.info('user or pswd not exist');
                response.status(401).send();
            }
            else if (request.fields.user !== user
                || request.fields.pswd !== password) {
                console.info('user or pswd are not correct');
                response.status(401).send();
            }
            else {
                console.info('basic auth: success');
                return next();
            }
        };
    };
    ;
    return RPCBasicAuth;
}());
exports.RPCBasicAuth = RPCBasicAuth;
module.exports = {
    ExpressRPC: ExpressRPC, RPCBasicAuth: RPCBasicAuth
};
