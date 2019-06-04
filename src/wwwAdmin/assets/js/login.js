/**
    Admin login
**/

depp.require('general', function() {

    // wrong credentials error message on fail of basic auth
    let errorMessage = sessionStorage.getItem('errorMessage');
    if (errorMessage !== null) {

        $('#error').text(errorMessage).removeClass('d-hide');
        sessionStorage.removeItem('errorMessage');

    }

    //admin login
    $(document).on('click', '#btn-login', function() {

        let formLogin = $("#login-form input[name='login']").val();
        let formPassw = $("#login-form input[name='password']").val();

        window.sessionStorage.setItem('username', formLogin);
        window.sessionStorage.setItem('password', formPassw);

        window.location = '/crudEditors';

    });

    $(document).on('click', '#sign-out', function(e) {

        sessionStorage.removeItem('username');
        sessionStorage.removeItem('password');
        if (window.location.pathname !== '' && window.location.pathname !== '/') {
            window.location.replace('/');
        }
        
    });

 });
