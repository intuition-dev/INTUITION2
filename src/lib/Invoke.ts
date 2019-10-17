// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

const fetch = require('node-fetch')

var logger = require('tracer').console()

const btoa = function(str){ return Buffer.from(str).toString('base64'); }

// requires promise and fetch for ie11, you should require 'poly'
export class httpRPC {// 
    // uses simple auth
    httpOrs // protocol
    host
    port
  
    /**
     * 
     * @param httpOrs should be 'https'
     * @param host 
     * @param port 
     * 
     * eg:
        var pro = window.location.protocol
        pro = pro.replace(':', '')
        var host = window.location.hostname
        var port = window.location.port
     */
    constructor(httpOrs, host:string, port) {
      this.httpOrs = httpOrs
      this.host = host
      this.port = port
  
      logger.trace(this.httpOrs, this.host, this.port)
  
    }
    //apiPath=''
    user=''
    pswd=''
    setUser(user,pswd) { // simple auth,
      this.user = user
      this.pswd = pswd 
    }
    token =''
    setToken(token) { 
      this.token=token
    }
  
    /**
     * @param route api apth, eg api
     * @param ent  viewmodel name | page name | screen name | component name | calling url | ECSid 
     * @param method CRUD, insert, check, listAll, etc
     * @param params Object of name value pairs.
     */
    invoke(route, ent, method, params):Promise<string> { // returns promise of results or err
      //if array, return as array
      if(!params) params = {}
  
      params.ent=ent
      params.method=method
      params.user = btoa(this.user)
      params.pswd = btoa(this.pswd)
      params.token = btoa(this.token)
  
      let query = Object.keys(params)
               .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
               .join('&')
  
      const THIZ = this
      return new Promise(function(resolve, reject) {
        //console.info(formData.get('method'))
        let url:string = THIZ.httpOrs+'://'+THIZ.host + (THIZ.port ? (':' + THIZ.port) : '') + '/'+route 
  
        url = url + '/?' + query
      
        fetch(url, {
              method: 'GET',
              cache: 'default',
              redirect: 'follow',
              mode: 'cors',
              //credentials: 'include',
              keepalive: true
  
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
              logger.trace('fetch err')
              logger.trace(err)
              reject(err)
            })
        })//pro
    }//invoke()
  
  
  }//class
  
  