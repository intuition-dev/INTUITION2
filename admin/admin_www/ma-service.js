// needs axios loaded ahead
class MetaAdminService {
   // jsdoc MetaAdminService.js
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
    * Do a nbake 'bake' in that folder.
    * Returns a promise, than( resp.dat )/catch{error}
    * @param folder folder - ex '/'
    */
   bake(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/bake'+dir)
   }
   /**
    * Do a nbake -t 'tag process' in that folder.
    * Returns a promise, than( resp.dat )/catch{error}
    * @param folder folder - ex '/'
    */
   tag(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/tag'+dir)
   }
   /**
    * Do a nbake -i 'itemize' in that folder.
    * Returns a promise, than( resp.dat )/catch{error}
    * @param folder folder - ex '/'
    */
   itemize(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/itemize'+dir)
   }

}//class
// tst ////////////////////////////////

const user =  {
   username: 'admin',
   password: '123'
}
const  baseURL = 'http://localhost:9090'
const aSrv = new MetaAdminService(baseURL, user)

aSrv.tag('/').then(function(resp) {
   console.log(resp.data)
}).catch(function (error) {
   console.log(aSrv.getError(error))
})

