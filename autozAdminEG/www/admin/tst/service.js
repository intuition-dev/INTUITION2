class AdminService {
    constructor(baseURL_, secret) {
        console.log(secret);
        this.service = axios.create({
            baseURL: baseURL_,
            auth: {
                username: 'admin',
                password: secret
            }
        });
    }
}
class AdminAuth {
    save(secret) {
        sessionStorage.setItem('maAuth', secret);
    }
    get secret() {
        return sessionStorage.getItem('maAuth');
    }
    exists() {
        if (!this.secret)
            return false;
        if (this.secret.length < 2)
            return false;
        return true;
    }
    clear() {
        sessionStorage.removeItem('maAuth');
    }
}
