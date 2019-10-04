
toolBeltDefault()

depp.define({
   'fraglist':'/items/custels/fraglist/fraglist-custel.js'
  })

depp.require(['DOMDelayed', 'jquery'], function() {

   resizeVid()
   console.log('ready')
})//depp

// https://codetheory.in/html5-fullscreen-background-video/
window.addEventListener('resize', resizeVid) 
function resizeVid() {
   var w = $(window).width() - 184 
   var h = $(window).height() - 75

   // math?
   var nw = 16
   var nh = 0
   while (nw <= w) {
         nh = nw * 0.5625
         if( (nh+75+5) > h) break
         nw = nw + 1
   }

   //console.log('c:', w, h, nw, nh)       
   nw = nw-50

   $('.mediaContainerTop').width( nw)
   $('.mediaContainerTop').height( nh )
}//()


//TODO:
// http://dinbror.dk/blog/how-to-preload-entire-html5-video-before-play-solved/
