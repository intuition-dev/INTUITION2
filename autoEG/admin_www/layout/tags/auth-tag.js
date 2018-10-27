
riot.tag2('auth-tag', '', '', '', function(opts) {

    const fconfig = {
    	apiKey: 'AIzaSyCU3yQSeCsQ'+'-'+'uIDAl3ooT8LqaVWQAutHMI',
    	authDomain: 'mymeta-host.firebaseapp.com',
    	projectId: 'mymeta-host'
    }

    const baseURL = 'https://appthingsapi.mymeta.host'

    window.firebase.initializeApp(fconfig)
    this.impl = firebase.auth()
    this.impl.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    this.isLoggedIn = function(){
    	return AdminAuth.isLoggedIn()
    }.bind(this)

    this.ensureService = function(){
    	if (!window.aSrv && this.isLoggedIn())
    		window.aSrv = new MetaAdminService(baseURL)

    	depp.done('login')
    	console.log('ensure servicd depp.done login')
    }.bind(this)

    this.signInWithEmailAndPassword = function(email, pw) {
    	return this.impl.signInWithEmailAndPassword(email, pw)
    }.bind(this)

    this.logout = function() {
    	AdminAuth.clear()
    	return this.impl.signOut()
    }.bind(this)

    this.connectToService = function(username, code){

    	AdminAuth.save(username, code)

    	this.impl.currentUser.getIdToken(false)
    	.then(function(idToken) {

    		AdminAuth.saveJwt(idToken)
    		window.aSrv = connect(baseURL)
    		.then(function(user) {
    			depp.done('login')
    			console.log('connectToService depp.done login')
    		})

    	}).catch(function(error) {
    	 alert(error)
    	});

    }.bind(this)

    function isUserIn() {
    	if(!this.impl || !this.impl.currentUser) return false

    	return true
    }

    this.impl.onAuthStateChanged(function(user_) {
    	if (isUserIn()) {
    		console.log('CRUDauth', true)
    	}
    	else {
    		console.log('CRUDauth','bye')
    	}
    })

    this.sendEmailVerification = function() {
    	if(!isUserIn()) {
    		alert('sending', this.impl.currentUser)
    		console.log('sending', this.impl.currentUser)
    		this.impl.currentUser.sendEmailVerification()
    	}
    	else {
    		alert('no currentUser')
    		console.log('no currentUser')
    	}
    }.bind(this)
});