/**
    Admin login
**/
class BindLogin {
    constructor() {
        this.AdminWebAdmin = new AdminWebAdmin()
    }
    login(email, pass) {
        console.info("--pass:", pass)
        console.info("--email:", email)
        this.AdminWebAdmin.checkAdmin(email, pass)
            .then(function (result) {
                console.info("--result:", result)
                if (result) {
                    window.sessionStorage.setItem('username', email);
                    window.sessionStorage.setItem('password', pass);

                    window.location = '/admin/crudEditors';
                } else {
                    window.location = '/admin/'
                }
            })
    }
    signOut() {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('password');
        if (window.location.pathname !== '' && window.location.pathname !== '/') {
            window.location.replace('/');
        }
    }

    sendVcode(email) {
        if (email !== '') {
            this.AdminWebAdmin.sendVcode(email)
                .then(function (result) {
                    console.info("--result:", result)
                })
        }
    }

    resetPass(email, code, pass) {
        if (email !== '' && pass !== '' && code !== '') {
            this.AdminWebAdmin.resetPass(email, code, pass)
                .then(function (result) {
                    if (result) {
                        alert("Password changed")
                    } else {
                        alert("Error")
                    }
                    console.info("--result:", result)
                })
        }
    }
}
