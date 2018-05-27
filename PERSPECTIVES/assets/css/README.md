# semi
smaller semantic 

http://github.com/doabit/semantic-ui-sass

you need only 
http://github.com/doabit/semantic-ui-sass/tree/master/app/assets/stylesheets

and work with prepros.io as normal.

edit font, etc.

On page where you need:
http://jsdelivr.com/package/npm/semantic-ui?path=dist%2Fcomponents


load smalles css semnatic 1
and then after load semantic 2

ex:

loadjs([ '//cdn.jsdelivr.net/npm/semantic-ui@2.3.1/dist/components/sidebar.min.js'


loadjs.ready(['style'], function () { //load large css
	loadjs([ '/assets/css/semnatic2.css'
	], 'css2', {
		async: false //required due to loadjs bug with bundles
	})
})