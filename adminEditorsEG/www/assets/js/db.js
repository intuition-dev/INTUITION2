var config = {
   apiKey: 'AIzaSyD7P7FfaeH3EShfyEtJuxeNYUHdI-u1Mvk',
   authDomain: 'blog-editors.firebaseapp.com',
   projectId: 'blog-editors'
};
window.firebase.initializeApp(config);

window.auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

window.db1 = window.firebase.firestore();

db1.settings({
   timestampsInSnapshots: true
})
   
function isUserIn() {
   if(!auth.currentUser) return false
   return auth.currentUser.emailVerified
}

function sendEmailVerification() {
   if(!isUserIn()) {
      console.info('sending', auth.currentUser);
      auth.currentUser.sendEmailVerification();
   } else {
      console.info('no currentUser');
   }

   auth
      .onAuthStateChanged(user_ => {
         if (isUserIn()) {
            console.info('CRUDauth', isUserIn());
         }
         else {
            console.info('CRUDauth','bye')
         }
      });
}