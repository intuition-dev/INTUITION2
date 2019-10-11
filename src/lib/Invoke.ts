// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

// requires promise and fetch for ie11, you should require 'poly'
class httpRPC {// 
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
  
      console.log(this.httpOrs, this.host, this.port)
  
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
  
        console.log(url)
    
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
              console.log('fetch err')
              console.log(err)
              reject(err)
            })
        })//pro
    }//invoke()
  
  
    /**
     * Place this in ViewModel and vm calls the rpc
     * and then in page you can say vm.log(..)
     * @param msg 
     * @param level 
     * @param className 
     */
    log(msg:string, level?:number, className?:string) {
      var THIZ = this
      let p = {
        msg: msg,
        page: window.location.pathname,
        level: level,
        className: className
      }
      
      try {
        p['appVersion'] = btoa(navigator.appVersion)
        p['userAgent'] = btoa(navigator.userAgent)
        p['platform'] = btoa(navigator.platform)
      } catch(err) {console.trace(err)}
  
      setTimeout(function(){
        //send to server
        THIZ.invoke('log','log', 'log', p)
      },1)
      if(className) console.info(className, level, msg)
      else console.info(msg)
    }//()
  
  }//class
  
  