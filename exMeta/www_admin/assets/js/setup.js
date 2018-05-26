
 // http://github.com/muicss/loadjs/issues/56

 // https://jsfiddle.net/muicss/4791kt3w
 function require(bundleIds, callbackFn) {
	bundleIds.forEach(function(bundleId) {
		if (!loadjs.isDefined(bundleId)) loadjs(bundles[bundleId], bundleId, {
			async: false //required due to loadjs bug with bundles
		})
	})
	loadjs.ready(bundleIds, callbackFn)
}

// polyfills
if (!window.Promise) {
	/* load bundle 'promise' */
	loadjs(['//cdn.jsdelivr.net/es6-promise-polyfill/1.2.0/promise.min.js'], 'promise', {
		async: false //required due to loadjs bug with bundles
	})
}
else loadjs.done('promise') /* we already have it */

if (!window.fetch) {
	loadjs(['//cdn.jsdelivr.net/fetch/2.0.1/fetch.min.js'], 'fetch', {
		async: false //required due to loadjs bug with bundles
	})
}
else loadjs.done('fetch')

///////////////////////////////////////////////////////////////////////////////////
// ready = "when done with bundle(s)"
loadjs.ready(['promise','fetch'], function () {
	/* load bundle 'core' */
	loadjs([
		'//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js'
	], 'core', { // bundle ID
			async: false //required due to loadjs bug with bundles
	})
})
loadjs.ready(['core'], function () {
	loadjs([ '//cdn.jsdelivr.net/npm/semantic-ui@2.3.1/dist/components/sidebar.min.js'
		//,'//cdn.jsdelivr.net/npm/intersection-observer@0.5.0/intersection-observer.js'
		//,'/assets/js/meta-router.js'
	], 'cssJs', {
		async: false //required due to loadjs bug with bundles
	})
	$( document ).ready(function() {
		loadjs.done('site') // "done with bundle 'site'", need this because we're not loading js here
	})
})//()

function cssLoaded() {// called by the style sheet in layout
	console.log('css loaded', Date.now()-_start)
	loadjs.done('css')
}

loadjs.ready(['css', 'cssJs', 'site'], function () {
	setTimeout(function(){
		loadjs.done('style')
	},1000/60)
})



loadjs.ready(['style'], function () { //load large css
	setTimeout(function(){
		loadjs([ '/assets/css/semantic2.css'
			,'//unpkg.com/ionicons@4.0.0/dist/css/ionicons.min.css' // http://ionicons.com/usage
		], 'css2', {
			async: false //required due to loadjs bug with bundles
		})
	},1000/60)
})
console.log('setup', "v2.05.12")
// usage: ////////////////////////////////////////////////////////////////////
loadjs.ready(['core'], function () {// load data
	console.log('core done', Date.now()-_start)
})
loadjs.ready(['site'], function () {// do nav, signal is ready, but not style
	console.log('site done', Date.now()-_start)
})
loadjs.ready(['style'], function () {// 'show' page, ex: unhide
	console.log('style done', Date.now()-_start)
})
loadjs.ready(['css2'], function () {// 'show' page, ex: unhide
	console.log('css2 done', Date.now()-_start)
})

window.addEventListener('pageshow', function(event) {
	console.log('pageshow:', event.timeStamp)
})
window.addEventListener('load', function(event) {
	console.log('load:', event.timeStamp)
})

// util: /////////////////////////////////////////////////////////////////////
function getUrlVars() {
	var vars = [], hash
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=')
		vars.push(hash[0])
		vars[hash[0]] = hash[1]
	}
	return vars
}
