
declare var axios: any


class AdminService {
   service
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

}

/**
* Login and logout to Meta Admin Service
* @example
   const aa = new AdminAuth()
   aa.save('123')
   console.log(aa.secret)

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