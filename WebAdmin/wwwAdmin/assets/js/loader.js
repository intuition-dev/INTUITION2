document.addEventListener("DOMContentLoaded", onDeviceReady, false)

function onDeviceReady() {
    console.info('deviceready');
    depp.done('deviceready');
}

var responces = [];

depp.define({
    'scripts': [
        '//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js'
        ,'//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/js/tabulator.min.js'
        , '/assets/3rd/gridforms.js'
        , '//unpkg.com/axios@0.19.0-beta.1/dist/axios.min.js'
        , ROOT + 'assets/css/spectreBottom.css'
    ],
    'services': [
        '#scripts'
        ,'/assets/js/services.js'
    ],
    'general': [
        '#services'
        ,'/assets/js/general.js'
    ],
    'rw': [
        '#general'
        ,'/assets/js/login.js'
        , '/assets/js/ui.js'
    ],
    'crud': [
        '#rw'
        , ROOT + 'assets/js/crud.js'
    ],
    'fonts': [
        '#crud'
        ,'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);