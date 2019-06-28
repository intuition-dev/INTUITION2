// All rights reserved by MetaBake (MetaBake.org) | Cekvenich, licensed under LGPL 3.0

//TODO: JSON compress response
//TODO: b64  encode params

// requires FormData, promise and fetch for ie11, you should require 'polly'
class httpRPC {// 
  // uses simple auth
  httpOrs // protocol
  host
  port

  /**
   * 
   * @param httpOrs MUST use 'https'
   * @param host 
   * @param port 
   */
  constructor(httpOrs, host:string, port) {
    this.httpOrs = httpOrs
    this.host = host
    this.port = port

    this.user = 'guest' // default is guest user

    console.log(this.httpOrs, this.host, this.port)

  }
  //apiPath=''
  user
  pswd
  setUser(user,pswd?) { // simple auth,
    this.user = user
    this.pswd = pswd // 
  }

  /**
   * @param route api apth, eg api
   * @param ent  viewmodel name | page name | screen name | component name | calling url | VM name | ECSid - should contain route: pageOne
   * @param method CRUD, insert, check, listAll, etc
   * @param params Object of name value pairs, likely include corp so setUser('x') can check if allowed. Params must be JSON safe, so maybe b64
   */
  invoke(route, ent, method, params):Promise<string> { // returns promise of results or err
    //if array, return as array

    let formData = new FormData()
    formData.append('params', JSON.stringify(params))

    formData.append('user', btoa(this.user))
    formData.append('pswd', btoa(this.pswd))

    formData.append('method', method)

    const THIZ = this
    return new Promise(function(resolve, reject) {
      //console.info(formData.get('method'))
      const url:string = THIZ.httpOrs+'://'+THIZ.host + (THIZ.port ? (':' + THIZ.port) : '') + '/'+route + '/'+ent
      console.log(url)
      fetch(url, {
            body: formData 
            ,method: 'post',
          })//fetch
          .then(function(fullResp) {
            const obj = fullResp.json();
            
            if(!fullResp.ok) 
              reject(obj)
             else {
              return obj
            }
          })
          .then(function(resp) {
            if(resp.errorMessage) {
              reject(resp)
            }
            resolve(resp.result)
          })//fetch
          .catch(function (err) {
            console.log('fetch err')
            console.log(err)
            reject(err)
          })
      })//pro
    }//req()
}//class
