
class MetaAdminService {
   // jsdoc service.js
   constructor(baseURL_, users_) {
      this.service = axios.create({
         baseURL: baseURL_
            , auth: users_
      })
   }//cons
   getError(error) {
      if(!error.response) return error
      if(error.response.data) return (error.response.data)
      return error.response.statusText
   }

   /**
    * Returns a promise, than()/catch{}
    * @param folder folder - User's folder
    */
   getUser(folder) {
      return this.service.get('/getUser')
   }


}//class

// ////////////////////////////////

const users =  {
   username: 'admin',
   password: '123'
}
const  baseURL = 'http://localhost:9090'

aSrv = new MetaAdminService(baseURL, users)

aSrv.getUser().then(function(resp) {
   console.log(resp.data)
}).catch(function (error) {
   console.log(aSrv.getError(error))
})

