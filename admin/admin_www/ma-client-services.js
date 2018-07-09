// needs axios loaded ahead
class MetaAdminService {
   // npm install -g documentation
   // documentation build ma-client-services.js -f html -o api
   // don't upload css else fix in S3 
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
    * Get the last message from the last executed command
    * @returns a promise, than( resp.dat )/catch{error}
    * @param folder folder - ex '/'
    */
   last() {
      return this.service.get('/api/last')
   }
   /**
    * Do a nbake 'bake' in that folder.
    * @returns a promise, than( resp.dat )/catch{error}
    * @param folder folder - ex '/'
    */
   bake(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/bake'+dir)
   }
   /**
    * Do a nbake -t 'tag process' in that folder.
    * @returns a promise, than( resp.dat )/catch{error}
    * @param folder folder - ex '/'
    */
   tag(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/tag'+dir)
   }
   /**
    * Do a nbake -i 'itemize' from the mount
    * @returns a promise, than( resp.dat )/catch{error}
    */
   itemize() {
      return this.service.get('/api/itemize')
   }

}//class
// tst ////////////////////////////////

const user =  {
   username: 'admin',
   password: '123'
}
const  baseURL = 'http://localhost:9083'
const aSrv = new MetaAdminService(baseURL, user)

aSrv.last().then(function(resp) {
   console.log(resp.data)
}).catch(function (error) {
   console.log(aSrv.getError(error))
})

