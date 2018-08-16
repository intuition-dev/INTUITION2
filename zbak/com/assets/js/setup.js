
$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false
    if (document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true
    }

    //window.isphone = false // use only for file testing

    console.log('phonegap?', window.isphone)
    if (window.isphone) { // //file is a browser
        document.addEventListener("deviceready", onDeviceReady, false)
    } else {
        onDeviceReady()
    }
})

function onDeviceReady() { // nothing will work before this
    console.log('deviceready!')
    loadjs(['https://cdn.jsdelivr.net/npm/semantic-ui@2.3.1/dist/components/sidebar.min.js'
        , 'https://cdn.jsdelivr.net/npm/signals@1.0.0/dist/signals.min.js'
        //,

    ], 'cssJs')
}

function cssLoaded() {// called by the style sheet in layout
    console.log('css loaded', Date.now() - _start)
    loadjs('/assets/css/semantic2.css')
    loadjs.done('css')
}

loadjs.ready(['css', 'cssJs'], function() {
    setTimeout(function() {
        loadjs.done('style')
    }, 1000 / 60)
})

// usage: ////////////////////////////////////////////////////////////////////
loadjs.ready(['style'], function() {// 'show' page, ex: unhide
    console.log('style done', Date.now() - _start)



})
