class ApiService {
    constructor(username, password) {
        this.service = axios.create({
            baseURL: window.env == 'isProd' ? window.DEV_API[0] : window.LOCAL_API[0],
            auth: {
                username: username,
                password: password
            },
            responseType: 'json'
        });

        this.service.interceptors.response.use(function(response) {
            // Do something with response data
            console.log('response', response);
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

    // get data for companies collection from node
    getCompaniesList() {
        return this.service.get('/auth/companies');
    }

    // add company to collection through node to FS
    saveCompany(name) {
        return this.service.post('/auth/companies', {
            name: name
        }).then(resp => resp.data);
    }

    // remove company from the collection through node from FS
    removeCompany(id) {
        return this.service.delete('/auth/companies', {
            params: {
                id: id
            }
        });
    }

    // edit company in the collection through node in FS
    editCompany(id, name) {
        return this.service.put('/auth/companies', {
            id: id,
            name: name
        }).then(resp => resp.data);
    }

    // get data for employees collection throught node in FS
    getEmployeesList(companyId, companyName) {
        return this.service.get('/auth/employees', {
            params: {
                company: companyId
            }
        });
    }

    // add user to collection throught node to FS
    addEmployee(companyId, name, email, password) {
        return this.service.post('/auth/employees', {
            company: companyId,
            name: name,
            email: email,
            password: password
        });
    }

    // edit user to collection throught node to FS
    editEmployee(uid, name, companyName) {
        return this.service.put('/auth/employees', {
            name: name,
            uid: uid
        });
    }

    // delete user to collection throught node to FS
    deleteEmployee(uid, companyName) {
        return this.service.delete('/auth/employees', {
            params: {
                uid: uid
            }
        });
    }

}