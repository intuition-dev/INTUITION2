export class Firebase {
   get() {
      const firebase = require("firebase");
      if (!firebase.apps.length) {
         firebase.initializeApp({
            apiKey: process.env.FB_API_KEY,
            authDomain: process.env.FB_AUTH_DOMAIN,
            projectId: process.env.FB_PROJECT_ID
         });
      }
      
      return firebase;
 
   }
}
 
module.exports = {
   Firebase
}