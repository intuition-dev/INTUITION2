
riot.tag2('auth-tag', '', '', '', function(opts) {

    const fconfig = {
    	apiKey: 'AIzaSyCU3yQSeCsQ'+'-'+'uIDAl3ooT8LqaVWQAutHMI',
    	authDomain: 'mymeta-host.firebaseapp.com',
    	projectId: 'mymeta-host'
    }

    const baseURL = 'https://appthingsapi.mymeta.host'

    const actionCodeSettings = {

    	url: 'https://appthings.mymeta.host/screen/posts/?register',

    	handleCodeInApp: true
    }

    window.firebase.initializeApp(fconfig)
    this.impl = firebase.auth()
    this.impl.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    this.isLoggedIn = function(){
    	return AdminAuth.isLoggedIn()
    }.bind(this)

    this.ensureService = function(){
    	if (!window.aSrv && this.isLoggedIn()) {
    		window.aSrv = new MetaAdminService(baseURL)
    		depp.done('login')
    	}
    }.bind(this)

    this.register = function(email, pw, fname, lname) {
    	AdminAuth.save(email, pw)
    	const impl = this.impl

    	return new Promise(function(resolve, reject) {

    		if (!impl.isSignInWithEmailLink(window.location.href)) {
    			reject('Not a valid invitation')
    		}

    		impl.signInWithEmailLink(email, window.location.href)
    		.then(function(user) {
    			return impl.currentUser.updatePassword(pw)
    		}).then(function() {
    			return impl.currentUser.updateProfile({displayName: fname + ' ' + lname})
    		}).then(function() {
    			return impl.currentUser.getIdToken(true)
    		})
    		.then(function(idToken) {
    			AdminAuth.saveJwt(idToken)
    			window.aSrv = new MetaAdminService(baseURL)
    			return window.aSrv.getLast()
    		})
    		.then(function() {
    			resolve()
    		}).catch(function (error) {
    			console.log(error)
    			console.log(window.aSrv.getError(error))
    			reject(error)
    		})
    	})
    }.bind(this)

    this.login = function(email, pw) {
    	AdminAuth.save(email, pw)
    	const impl = this.impl

    	return new Promise(function(resolve, reject) {

    		impl.signInWithEmailAndPassword(email, pw).then(function(user) {

    			return impl.currentUser.getIdToken(false)
    		})
    		.then(function(idToken) {
    			AdminAuth.saveJwt(idToken)
    			window.aSrv = new MetaAdminService(baseURL)
    			return window.aSrv.getLast()
    		})
    		.then(function() {
    			resolve()
    		}).catch(function (error) {
    			console.log(error)
    			console.log(window.aSrv.getError(error))
    			reject(error)
    		})
    	})
    }.bind(this)

    this.invite = function(email) {
    	const impl = this.impl
    	let pw = '!Te456'

    	return new Promise(function(resolve, reject) {

    		impl.createUserWithEmailAndPassword(email, pw)
    		.then(function(res) {
    			window.aSrv.newUser(res.user.uid, 'Editor');
    			impl.signInWithEmailAndPassword(email, pw)
    		})
    		.then(function() {
    			impl.signOut()
    		})
    		.then(function() {
    			impl.sendSignInLinkToEmail(email, actionCodeSettings)
    		})
    		.then(function() {
    			impl.signInWithEmailAndPassword(AdminAuth.username(), AdminAuth.secret())
    		})
    		.then(function() {
    			resolve()
    		})
    		.catch(function(error){
    			console.log(error)
    			let msg = error
    			if (msg=='Error: The email address is already in use by another account.')
    				msg = 'This person has already been invited'
    			reject(msg)
    		})
    	})
    }.bind(this)

    this.logout = function() {
    	AdminAuth.clear()
    	return this.impl.signOut()
    }.bind(this)

    this.connectToService = function(username, code){

    	AdminAuth.save(username, code)

    	this.impl.currentUser.getIdToken(false)
    	.then(function(idToken) {
    		console.log(idToken)
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