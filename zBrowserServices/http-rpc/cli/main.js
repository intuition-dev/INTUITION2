

const rpc = new httpRPC('http', 'localhost', 8888)

const pro = rpc.invoke('api', 'pageOne', 'multiply', {a:5, b:2})
pro.then(function(resp) {
  console.log(resp)
})

// Error example: there is no method multiplyXXX
/*
const proErr = rpc.invoke('api','pageOne','multiplyXXX', {a:5, b:2})
proErr.then(function(resp) {
  console.log(resp)
}).catch(function (err) {
  console.log('err')
  console.log(err)
})
*/
