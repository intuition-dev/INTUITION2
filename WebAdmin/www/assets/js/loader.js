document.addEventListener("DOMContentLoaded", onDeviceReady, false);

function onDeviceReady() {
    console.info('deviceready');
    depp.done('deviceready');
}

var responces = [];

depp.define({
    'scripts': [
        '//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.slim.min.js'
        , '/assets/3rd/gridforms.js'
        , '//unpkg.com/axios@0.19.0-beta.1/dist/axios.min.js'
        , '//cdn.jsdelivr.net/npm/zebra_datepicker@1.9.6/dist/zebra_datepicker.min.js'
        , ROOT + 'assets/css/spectreBottom.css'
    ]
});

depp.require(['scripts'], function() {
    depp.define({
        'services': [
            '/assets/js/db.js'
            , '/assets/js/services.js'
        ]
    });
});

depp.require(['services'], function() {
    depp.define({
        'edit': [
            '/assets/js/edit.js'
        ],
        'general': [
            '#edit'
            , '/assets/js/general.js'
            ,'/assets/js/login.js'
        ]
    });
});

depp.require(['general'], function() {
    depp.define({
        'rw': [
            '/assets/js/ui.js'
        ],
        'fonts': [
            '#rw'
            ,'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
        ]
    });
});

depp.require(['fonts']);