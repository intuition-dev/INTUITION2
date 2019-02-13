class ApiService {
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

    // get data for editors table
    getEditorsList() {
        return this.service.get('/auth/editors');
    }

    // add user to collection through node to FS
    addEditor(name, email, password) {
        return this.service.post('/auth/editors', {
            name: name,
            email: email,
            password: password
        });
    }

    // edit user to collection through node to FS
    editEditor(uid, name) {
        return this.service.put('/auth/editors', {
            name: name,
            uid: uid
        });
    }

    // delete user to collection through node to FS
    deleteEditor(uid) {
        return this.service.delete('/auth/editors', {
            params: {
                uid: uid
            }
        });
    }

}