//load full page: this is why async: false in setup
loadjs.ready('site', function () {
	console.log('loading full page!')
	loadjs([
		'//cdn.jsdelivr.net/npm/fullpage.js@2.9.7/dist/jquery.fullpage.css',
		'//cdn.jsdelivr.net/npm/fullpage.js@2.9.7/vendors/scrolloverflow.min.js',
		'//cdn.jsdelivr.net/npm/fullpage.js@2.9.7/dist/jquery.fullpage.js'
	], 'fullPage', {
		async: false
	})
})

loadjs.ready('fullPage', function () {
	console.log('onFullPage')
	$('#fullPage').fullpage({
		scrollOverflow: true,
		bigSectionsDestination: top,
		paddingTop: '1.25em',
		verticalCentered: false,

		css3: false,
		lazyLoading: true
	 })
})//()
