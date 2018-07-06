
declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

const server = require('express')()
const basicAuth = require('express-basic-auth')
const cors = require('cors')
server.use(cors())
server.use(basicAuth({
   users: { 'admin': '123' }
}))
export class BakeSrv {
   bake() {
      
   }
}

const bakeSrv = new BakeSrv()
// ///////////////////////////////////////

server.get('/listUsers', function (req, res) {
   res.setHeader('Content-Type', 'application/json')
   res.json({ a: 1 })
   //res.status(500).send('Something broke!')
})

server.get('/api/bake', function (req, res) {
   res.setHeader('Content-Type', 'application/json')
   res.json({ a: 1 })
   //res.status(500).send('Something broke!')
})


// ///////////////////////////////////////
var listener = server.listen(9090, function () {
   var host = listener.address().address
   var port = listener.address().port
   console.log("Server listening at http://%s:%s", host, port)
})

