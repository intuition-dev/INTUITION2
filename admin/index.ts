
declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

const restify = require('restify')
const corsMiddleware = require('restify-cors-middleware')
const errs = require('restify-errors')
const passport = require('passport-restify')
const LocalStrategy = require('passport-local').Strategy
// ///////////////////////////////////////
passport.use(new LocalStrategy({ session: false },
   function(username, password, done) {
      console.log(username, password)
      return done(null, username)
   })
)

var server = restify.createServer()
var cors = corsMiddleware({
   origins: ['*'],
   allowHeaders: ['Authorization']
})
server.pre(cors.preflight)
server.use(cors.actual)
server.use(passport.initialize())
server.use(passport.session())

// //////////////////////////////
server.get('/hello/:name', function(req, res, next) {
   //var err = new errs.InternalError('Not supported with current query params')
   //res.send(err)
   //next()
   //if(true) return
   res.json('hello ' + req.params.name)
   console.log('XXX XXX')
   next()
})

// //////////////////////////////
server.listen(9090, function() {
   console.log('%s listening at %s', server.name, server.url)
})
