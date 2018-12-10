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
               .catch(error => {
                  console.log('login error', error);
                  alert(error); // replace with pretty popup
               })
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
                     localStorage.setItem('user_name', auth.currentUser.email);
                  });
            } else {
               if (window.location.pathname !== '/') {
                  window.location = ('/');
               }
            }
         });
   }
}