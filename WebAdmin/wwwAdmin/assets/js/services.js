/**
 * Version v4.2
 * 
 * All rights reserved by Metabake (mbake.org), licensed under LGPL 3.0
 *
*/

/**
* CRUD users for Editors App
*/
class ApiService {
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
                window.location = '/';
            } else if (401 === error.response.status) {
                window.sessionStorage.setItem('errorMessage', 'Access denied');
                window.location = '/';
            }
            return Promise.reject(error);
        });
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