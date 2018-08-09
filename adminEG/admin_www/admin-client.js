
// npm -g i documentation
// # documentation build --config documentation.yml admin-client.js -f html -o api
// Note: don't upload CSS, else fix in S3
// Version should sync w/ mbake version due to -a

/**
 * Version v3.8.4
 */
console.log('ma-client-services', 'v3.8.4')

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
    @returns true if secret exists
    */
   exists() {
      if (!this.secret)
         return false
      if (this.secret.length<2)
         return false
      return true
   }
   /**
    * Clear, for logout
   */
   clear() {
      sessionStorage.removeItem('maAuth')
   }
}//()

/**
* Create new MetaAdminService instance. Each installation should be bespoke to the application it will admin.
* Needs Axios loaded before - https://unpkg.com/axios/dist/axios.min.js.
* @returns MetaAdminService instance
* @param baseUrl - e.g. 'http://localhost:9083'
* @param secret - e.g. '123'
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
      console.log(secret)
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
      if (!error.response) return error
      if (error.response.data) return (error.response.data)
      return error.response.statusText
   }

   /**
    * Get the last message from the last executed command
    * @returns a promise, then(resp.dat)/catch{error}
    * @param folder folder - e.g. '/'
    */
   getLast() {
      return this.service.get('/api/last')
   }
   /**
    * Does an mbake 'bake' in that folder
    * @returns a promise, then(resp.dat)/catch{error}
    * @param folder folder - e.g. '/'
    */
   bake(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/bake'+dir)
   }
   /**
    * Does an mbake -t 'tag process' in that folder
    * @returns a promise, then(resp.dat)/catch{error}
    * @param folder folder - e.g. '/'
    */
   tag(folder) {
		let dir = '?folder='+folder
      return this.service.get('/api/tag'+dir)
   }
   /**
    * Does an mbake -i 'itemize' from the mount
    * @returns a promise, then(resp.dat)/catch{error}
    * @param folder folder - e.g. '/blog'
    */
   itemize(folder) {
      let dir = '?folder='+folder
      return this.service.get('/api/itemize'+dir)
   }
   /**
    * Try to get title, image and desc of an url. Can be used for linkblog.
    * @returns a promise, then(resp.dat)/catch{error}
    * @param url - e.g. 'https://www.usatoday.com/sports/'
    */
   scrape(url) {
      let arg = '?url='+btoa(url)
      return this.service.get('/api/scrape'+arg)
   }
   /**
    * Creates a new link blog item
    * @returns a promise, then(resp.dat)/catch{error}
    * @param src - e.g. '/blog/one'
    * @param dest - e.g. '/blog/newOne'
    * @param url - e.g. 'https://www.usatoday.com/sports/'
    * @param comment_ # in Markdown - e.g. 'This is an interesting article'
    * @param tags_ # CSV, eg: one, two
    */
   newLinkBlog(src, dest, url, comment_, tags_) {
      let arg = '?url='+btoa(url)
      arg = arg + '&src=' + src
      arg = arg + '&dest=' + dest
      console.log(arg)

      return this.service.post('/api/newLinkBlog'+arg, {
         comment: comment_, tags: tags_
      })
   }
   /**
    * Clones a folder/screen. The cloned is set to 'publish: false' in dat.yaml.
    * @returns a promise, then(resp.dat)/catch{error}
    * @param src - e.g. '/blog/one'
    * @param dest - e.g. '/blog/newOne'
    */
   clone(src, dest) {
      arg = arg + '?src=' + src
      arg = arg + '&dest=' + dest
      console.log(arg)
      return this.service.get('/api/clone'+arg)
   }
}//class

/**
 * Is the user logged in, based on saved cookie
 @param URL of service
 @returns a promise
 @example
   isLoggedIn(baseURL).then(function() {//ok
      console.log('Lxxx yes')
   }, function() {//rejected
      console.log('LXXX no')
   })
*/
function isLoggedIn(url) {
   const aa = new AdminAuth()
   return new Promise(function(resolve, reject) {
      if (aa.exists()) {
         const  baseURL = url
         let maSrv = new MetaAdminService(baseURL, aa.secret)
         maSrv.getLast().then(function(resp) {
            console.log(resp.data)
            resolve()
         }).catch(function (error) {
            console.log(error)
            console.log(maSrv.getError(error))
            reject()
         })
      } else //if no cookie
         reject()
   }) // pro
}//()

