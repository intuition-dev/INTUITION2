"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require('node-fetch');
var logger = require('tracer').console();
const btoa = function (str) { return Buffer.from(str).toString('base64'); };
class httpRPC {
    constructor(httpOrs, host, port) {
        this.user = '';
        this.pswd = '';
        this.token = '';
        this.httpOrs = httpOrs;
        this.host = host;
        this.port = port;
        logger.trace(this.httpOrs, this.host, this.port);
    }
    setUser(user, pswd) {
        this.user = user;
        this.pswd = pswd;
    }
    setToken(token) {
        this.token = token;
    }
    invoke(route, ent, method, params) {
        if (!params)
            params = {};
        params.ent = ent;
        params.method = method;
        params.user = btoa(this.user);
        params.pswd = btoa(this.pswd);
        params.token = btoa(this.token);
        let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            let url = THIZ.httpOrs + '://' + THIZ.host + (THIZ.port ? (':' + THIZ.port) : '') + '/' + route;
            url = url + '/?' + query;
            fetch(url, {
                method: 'GET',
                cache: 'default',
                redirect: 'follow',
                mode: 'cors',
                keepalive: true
            })
                .then(function (fullResp) {
                const obj = fullResp.json();
                if (!fullResp.ok)
                    reject(obj);
                else {
                    return obj;
                }
            })
                .then(function (resp) {
                if (resp.errorMessage) {
                    reject(resp);
                }
                resolve(resp.result);
            })
                .catch(function (err) {
                logger.trace('fetch err');
                logger.trace(err);
                reject(err);
            });
        });
    }
}
exports.httpRPC = httpRPC;
