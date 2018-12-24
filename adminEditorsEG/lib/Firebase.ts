export class Firebase {
   get() {
      const firebase = require("firebase");
      
      if (!firebase.apps.length) {
         firebase.initializeApp({
            apiKey: 'AIzaSyD7P7FfaeH3EShfyEtJuxeNYUHdI-u1Mvk',
            authDomain: 'blog-editors.firebaseapp.com',
            projectId: 'blog-editors'
         });
      }
      
      return firebase;

   }
}

module.exports = {
   Firebase
}