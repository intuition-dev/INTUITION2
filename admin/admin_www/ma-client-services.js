   // npm -g i documentation
   // $ documentation build --config documentation.yml ma-client-services.js -f html -o api
   // or documentation serve --config documentation.yml --watch ma-client-services.js
   // note: don't upload css else fix in S3


/**
* Login and logout to Meta Admin Service
* @example
   const aa = new AdminAuth()
   aa.save('123')
   console.log(aa.secret)

   const  baseURL = 'http://localhost:9083'
const aSrv = new MetaAdminService(baseURL, aa.secret)
*/
class AdminAuth {
   /**
   * @param secret that you get from admin.yaml on server
   */
   save(secret) {
      sessionStorage.setItem('maAuth', secret)
   }
   /**
   * @returns secret used for MetaAdminService
   */
   get secret() {
      return sessionStorage.getItem('maAuth')
   }
   /**
   */
   clear() {
      sessionStorage.removeItem('maAuth')
   }
}//()

/**
* Create new MetaAdminService instance.
* It needs axios loaded before, ex: https://unpkg.com/axios/dist/axios.min.js.
* @returns MetaAdminService instance
* @param baseUrl ex: 'http://localhost:9083'
* @param secret ex: '123'
* @example
*   loadjs('/ma-client-services.js','ma-client')
*   loadjs.ready(['ma-client'], function () {
*   const  baseURL = 'http://localhost:9083'
*   const aSrv = new MetaAdminService(baseURL, '123')
*    aSrv.getLast().then(function(resp) {
*        console.log(resp.data)
*    }).catch(function (error) {
*        console.log(aSrv.getError(error))
*    })
*    })//ready
*/
class MetaAdminService {
   constructor(baseURL_, secret) {
      this.service = axios.create({
         baseURL: baseURL_
         , auth: {
            username: 'admin',
            password: secret
         }
      })
   }//cons

   /**
    * Gets the error
    * @returns error from the catch
    * @param error
    */
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
   getLast() {
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

const aa = new AdminAuth()
aa.save('123')
console.log(aa.secret)

const  baseURL = 'http://localhost:9083'
const aSrv = new MetaAdminService(baseURL, aa.secret)

aSrv.getLast().then(function(resp) {
   console.log(resp.data)
}).catch(function (error) {
   console.log(aSrv.getError(error))
})

