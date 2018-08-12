
$(document).ready(function () {
   // are we running in native app or in a browser?
   window.isphone = false
   if (document.URL.indexOf("http://") === -1
      && document.URL.indexOf("https://") === -1) {
      window.isphone = true
   }

   console.log('phonegap?', window.isphone)
   if (window.isphone) { // //file is a browser
      document.addEventListener("deviceready", onDeviceReady, false)
   } else {
      onDeviceReady()
   }
})

loadjs([
   'https://cdn.jsdelivr.net/npm/signals@1.0.0/dist/signals.min.js'
   , 'https://use.fontawesome.com/releases/v5.2.0/js/solid.js'
   , 'https://use.fontawesome.com/releases/v5.2.0/js/fontawesome.js'
   , ROOT + '/assets/css/gridforms/gridforms.css'
   , 'https://cdn.rawgit.com/terrylinooo/jquery.disableAutoFill/92cb6f86/src/jquery.disableAutoFill.js'

   , 'https://cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js'
   , 'https://cdn.jsdelivr.net/npm/blueimp-load-image@2.19.0/js/load-image.all.min.js'
   , 'https://cdn.jsdelivr.net/npm/is_js@0.9.0/is.min.js'

], 'cssJs')

function onDeviceReady() { // nothing will work before this
   console.log('deviceready!')
   loadjs.done('device')
}

function cssLoaded() {// called by the style sheet in layout
   loadjs.done('css')
}

loadjs.ready(['css', 'device', 'cssJs'], function () {

   loadjs(ROOT+'/admin-client.js','ma-client')
   //to notify of login
   let Signal = signals.Signal
   window.login = new Signal()

   loadjs.done('style')
})

let _scSz = true
function setupUserSzSc() {
   $( window ).scroll( function() {
      _scSz = true
   })
   $( window ).resize(function() {
      _scSz = true
   })
}//()
setInterval( function() {
  if ( _scSz ) {
   _scSz = false
   userSzSc()
  }
}, 150)

// usage: ////////////////////////////////////////////////////////////////////
loadjs.ready(['style'], function () {// 'show' page, ex: unhide
   setupUserSzSc()

   console.log('style done', Date.now() - _start)
})//ready

// util: /////////////////////////////////////////////////////////////////////
function getUrlVars() {
   var vars = [], hash
   var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
   for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=')
      vars.push(hash[0])
      vars[hash[0]] = hash[1]
   }
   return vars
}

