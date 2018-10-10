
riot.tag2('fb-tag', '', '', '', function(opts) {

    const fconfig = {
       apiKey: 'AIzaSyCU3yQSeCsQ'+'-'+'uIDAl3ooT8LqaVWQAutHMI',
       authDomain: 'mymeta-host.firebaseapp.com',
       projectId: 'mymeta-host'
    }

    window.firebase.initializeApp(fconfig)
    window.auth =firebase.auth()
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    window.db1  = window.firebase.firestore()
    const dsettings = {  timestampsInSnapshots: true}
    db1.settings(dsettings)

    function isUserIn() {
       if(!auth.currentUser) return false
       return auth.currentUser.emailVerified
    }

    auth.onAuthStateChanged(function(user_) {
       if (isUserIn()) {
          console.log('CRUDauth', true)
       }
       else {
          console.log('CRUDauth','bye')
       }
    })

    function sendEmailVerification() {
       if(!isUserIn()) {
          console.log('sending', auth.currentUser)
          auth.currentUser.sendEmailVerification()
       }
       else
          console.log('no currentUser')
    }
});