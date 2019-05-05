class Login {
	constructor() {
		this.checkUser = this.checkUser.bind(this);
		this.auth = this.auth.bind(this);
	}
	checkUser(formLogin, formPassw){
		if ((formPassw !== '') && (formLogin !== '') && (formPassw !== null) && (formLogin !== null)) {
			auth.signInWithEmailAndPassword(formLogin, formPassw)
				.then(user =>{
						if (user){
							this.auth();
						}
					})
				.then(() => {

					let hash = location.hash;
					window.location.replace('/editors/edit/' + hash);

				})
				.catch(error => {
					console.info('login error', error);
					if (error.code === 'auth/wrong-password') {
						$('#error').text('Wrong password').removeClass('d-hide');
					} else if (error.code === 'auth/user-not-found') {
						$('#error').addClass('d-hide').text('User not found, please check that login is correct').removeClass('d-hide');
					}
				});
			} else {
				console.info("All fields must be filled out");
				return false;
			}
	}
	auth(){
		// display username, get token and current user
		firebase
			.auth()
			.onAuthStateChanged(user => {
				if (user) {
					// get user token and name
					user
						.getIdToken()
						.then(idToken => {
							sessionStorage.setItem('idToken', idToken);
							window.sessionStorage.setItem('user_name', auth.currentUser.email);
						});
				} else {
					if (window.location.pathname !== '/') {
						window.location = ('/');
					}
				}
			});
	}
}

class SignOut {
	constructor() {
		this.signOut = this.signOut.bind(this);
	}
	signOut() {
		sessionStorage.clear();
		auth
			.signOut()
			.then(function() {
				window.location = ('/');
			}).catch(function(error) {
				console.info('Something went wrong:', error);
			});
	}
}

let logOut = new SignOut();

$('.sign-out').on('click', function(e) {
	e.preventDefault();
	logOut.signOut();
});

depp.require(['rw'], function() {

	let login = new Login();

    /*
    * login user
    */
	$(document).on('submit', '#login-form', function(e) {

		e.preventDefault();
		let formLogin = $("#login-form input[name='login']").val();
		let formPassw = $("#login-form input[name='password']").val();
        login.checkUser(formLogin, formPassw);
        
	});

    /*
    * reset password
    */
	$(document).on('click', '#reset-password-link', function() {

        $('#reset-password-form').removeClass('d-hide');
        $('#login-form').addClass('d-hide');

	});

	$('#reset-password-form').submit(function(e) {

        e.preventDefault();

        $('[class^="message"]').addClass('d-hide');

        let email = $(this).find('input[type="email"]').val();

        auth.sendPasswordResetEmail(email)
            .then(() => {

                $(this).find('fieldset, button').addClass('d-hide');
                $(this).find('.message-info').removeClass('d-hide').text('An email with the password reset link has been sent to your email address');

                setTimeout(function () {

                    $('#reset-password-form fieldset, #reset-password-form .btn-group, #login-form').removeClass('d-hide');
                    $('#reset-password-form, #reset-password-form p').addClass('d-hide');

                }, 5000);

            })
            .catch(function (error) {

                console.info('email hasn\'t been sent to user', error);
                $('.message-warning').removeClass('d-hide').text('No user exists with such email');

            });

	});

});