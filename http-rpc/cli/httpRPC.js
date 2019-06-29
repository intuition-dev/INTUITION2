var httpRPC = (function () {
    function httpRPC(httpOrs, host, port) {
        this.httpOrs = httpOrs;
        this.host = host;
        this.port = port;
        this.user = 'guest';
        console.log(this.httpOrs, this.host, this.port);
        var srv = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        console.log(srv);
    }
    httpRPC.prototype.setUser = function (user, pswd) {
        this.user = user;
        this.pswd = pswd;
    };
    httpRPC.prototype.invoke = function (route, ent, method, params) {
        var formData = new FormData();
        formData.append('params', JSON.stringify(params));
        formData.append('user', btoa(this.user));
        formData.append('pswd', btoa(this.pswd));
        formData.append('method', method);
        var THIZ = this;
        return new Promise(function (resolve, reject) {
            var url = THIZ.httpOrs + '://' + THIZ.host + (THIZ.port ? (':' + THIZ.port) : '') + '/' + route + '/' + ent;
            console.log(url);
            fetch(url, {
                body: formData,
                method: 'post',
            })
                .then(function (fullResp) {
                var obj = fullResp.json();
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
                console.log('fetch err');
                console.log(err);
                reject(err);
            });
        });
    };
    return httpRPC;
}());
