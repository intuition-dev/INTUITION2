
loadjs([
	'//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js'
], 'core')

loadjs.ready(['core'], function () {
	loadjs([ '//unpkg.com/vivid-icons@1.0.3/dist/vivid-icons.min.js'
	], 'cssJs')
	$( document ).ready(function() {
		loadjs.done('site')
	})
})//()

loadjs.ready([ 'cssJs', 'site'], function () { //load large css
	console.log('css loaded', Date.now()-_start)
	loadjs.done('style')
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
