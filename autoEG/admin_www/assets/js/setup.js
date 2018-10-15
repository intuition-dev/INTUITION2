
$(document).ready(function() {
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

depp.define({'cssJs': [
        'https://cdn.jsdelivr.net/npm/signals@1.0.0/dist/signals.min.js'
        , '/assets/js/jquery.disableAutoFill.js'
        , 'https://cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js'
        , 'https://cdn.jsdelivr.net/npm/blueimp-load-image@2.19.0/js/load-image.all.min.js'
        , 'https://cdn.jsdelivr.net/npm/is_js@0.9.0/is.min.js'
        , 'https://cdn.jsdelivr.net/npm/moment@2.22.2/moment.min.js' //post list formattingg
    ], 'ma-client': 
        [ROOT + 'admin-client.js']}
)

function onDeviceReady() { // nothing will work before this
    console.log('deviceready!')
    depp.done('device')
}

function cssLoaded() {// called by the style sheet in layout
    depp.done('css')
}

depp.require(['css', 'device', 'cssJs', 'ma-client'], function() {
    //depp.require(['ma-client'], function() { //moved up
    console.log('ma-client ready')
    //to notify that we are ready for login/login check
    let Signal = signals.Signal
    window.login = new Signal()
    depp.done('style')
    //})
})

let _scSz = true
function setupUserSzSc() {
    $(window).scroll(function() {
        _scSz = true
    })
    $(window).resize(function() {
        _scSz = true
    })
}//()
setInterval(function() {
    if (_scSz) {
        _scSz = false
        userSzSc()
    }
}, 150)

// usage: ////////////////////////////////////////////////////////////////////
depp.require(['style'], function() {// 'show' page, ex: unhide
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


