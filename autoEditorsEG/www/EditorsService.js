
// npm -g i documentation
// $ documentation build --config documentation.yml EditorsService.js -f html -o api
// Version should sync w/ mbake  CLI version 

/**
 * Version v4.11.23
 */
console.log('EditorsService', 'v4.11.23')

/**
* @example

*/
class EditorsService  {

   constructor() {

   }//cons

   getPagesList() { // FIRST
      
   }
   
}//()

var config = {
   apiKey: "AIzaSyBe-aYyf7mnGnpQ0MGX0V8PignXsd-aeHA",
   authDomain: "auth-f959b.firebaseapp.com",
   databaseURL: "https://auth-f959b.firebaseio.com",
   projectId: "auth-f959b",
   storageBucket: "auth-f959b.appspot.com",
   messagingSenderId: "421590478204"
 };
 firebase.initializeApp(config)

// firebase login
firebase.auth().signInWithEmailAndPassword('user2@example.com', 'secretPassword').catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   console.log()
   // ...
 })

// axios