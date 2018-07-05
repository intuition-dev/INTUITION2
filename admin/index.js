const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const errs = require('restify-errors');
var server = restify.createServer();
var cors = corsMiddleware({
    origins: ['*']
});
server.pre(cors.preflight);
server.use(cors.actual);
server.get('/hello/:name', function (req, res, next) {
    var err = new errs.InternalError('Not supported with current query params');
    res.send(err);
    next();
    if (true)
        return;
    res.send('hello ' + req.params.name);
    console.log('res');
    next();
});
server.listen(9090, function () {
    console.log('%s listening at %s', server.name, server.url);
});
