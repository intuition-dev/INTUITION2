"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomCors {
    cors() {
        return (request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', '*');
            response.setHeader('Access-Control-Allow-Headers', '*');
            response.setHeader('Access-Control-Expose-Headers', '*');
            if (request.method === 'OPTIONS') {
                response.status(204).send();
            }
            else {
                return next();
            }
        };
    }
    ;
}
exports.CustomCors = CustomCors;
module.exports = {
    CustomCors
};
