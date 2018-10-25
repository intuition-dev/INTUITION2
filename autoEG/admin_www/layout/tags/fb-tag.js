
riot.tag2('fb-tag', '', '', '', function(opts) {

    const fconfig = {
    	apiKey: 'AIzaSyCU3yQSeCsQ'+'-'+'uIDAl3ooT8LqaVWQAutHMI',
    	authDomain: 'mymeta-host.firebaseapp.com',
    	projectId: 'mymeta-host'
    }

    window.firebase.initializeApp(fconfig)
    window.auth = firebase.auth()
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

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

    this.sendEmailVerification = function() {
    	if(!isUserIn()) {
    		alert('sending', auth.currentUser)
    		console.log('sending', auth.currentUser)
    		auth.currentUser.sendEmailVerification()
    	}
    	else {
    		alert('no currentUser')
    		console.log('no currentUser')
    	}
    }.bind(this)
});