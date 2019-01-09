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
               window.location.replace('/editors/edit/');
            })
            .catch(error => {
               console.info('login error', error);
               alert(error);
            });
         } else {
            alert("All fields must be filled out");
            return false;
         }
   }
   auth(){
      // display username in header, get token and current user
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
            alert('An error happened.');
            console.info('Something went wrong:', error);
         });
   }
}

let logOut = new SignOut();
$('.sign-out').on('click', function(e) {
   e.preventDefault();
   logOut.signOut();
});