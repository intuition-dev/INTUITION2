/**
 * Version v4.2
 * 
 * All rights reserved by Metabake (Metabake.org), licensed under LGPL 3.0
 *
*/

/**
* CRUD users for Editors App
*/
class WebAdmin {
    /**
    * basic auth 
    * @param username user name
    * @param password user password
    */
    constructor(username, password) {
        this.service = axios.create({
            baseURL: window.api[0],
            auth: {
                username: username,
                password: password
            },
            responseType: 'json'
        });

        this.service.interceptors.response.use(function(response) {
            // Do something with response data
            console.info('response', response);
            return response;
        }, function(error) {
            // With response error redirect
            if (typeof error.response === 'undefined') {
                window.sessionStorage.setItem('errorMessage', 'Network Error');
                if (window.location.pathname !== '' && window.location.pathname !== '/') {
                    window.location.replace('/');
                }
            } else if (401 === error.response.status) {
                window.sessionStorage.setItem('errorMessage', 'Access denied');
                if (window.location.pathname !== '' && window.location.pathname !== '/') {
                    window.location.replace('/');
                }
            }
            return Promise.reject(error);
        });

        this.serviceRpc = new httpRPC(window.rpc.protocol, window.rpc.host, window.rpc.port);
        this.serviceRpc.setUser(username, password);
    }

    test() {
        return this.serviceRpc.invoke('/auth/editors', 'multiply', {a:5, b:2});
    }

    /**
    * get data for editors table
    */
    getEditorsList() {
        return this.service.get('/auth/editors');
    }

    /**
    * add new user
    * @param name user name, eg: 'Jane Doe'
    * @param email user email, eg: 'example@example.com'
    * @param password user password, eg: 'dfgsdgdsfg' 
    */
    addEditor(name, email, password) {
        return this.service.post('/auth/editors', {
            name: name,
            email: email,
            password: password
        });
    }

    /**
    * edit user name
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    * @param name user name, eg: 'Jane Doe'
    */
    editEditor(uid, name) {
        return this.service.put('/auth/editors', {
            name: name,
            uid: uid
        });
    }

    /**
    * remove user 
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    */
    deleteEditor(uid) {
        return this.service.delete('/auth/editors', {
            params: {
                uid: uid
            }
        });
    }

}