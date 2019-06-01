"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RPCBasicAuth {
    auth(user, password) {
        console.info('user rpc basic auth', user);
        let buffUser = new Buffer(user);
        user = buffUser.toString('base64');
        let buffPwd = new Buffer(password);
        password = buffPwd.toString('base64');
        return (request, response, next) => {
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
    }
    ;
}
exports.RPCBasicAuth = RPCBasicAuth;
module.exports = {
    RPCBasicAuth
};
