const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
var server = restify.createServer();
var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*']
});
server.pre(cors.preflight);
server.use(cors.actual);
function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    console.log('res');
    next();
}
server.get('/hello/:name', respond);
server.listen(9090, function () {
    console.log('%s listening at %s', server.name, server.url);
});
