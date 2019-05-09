var responces = [];

depp.define({
    'fb': [
        '#polly-core'
        , '#firestore'
    ]
});

depp.define({
    'scripts': [
        '#fb'
        , '#jquery'
        , '/assets/3rd/gridforms.js'
        , '//unpkg.com/axios@0.19.0-beta.1/dist/axios.min.js'
        , '//cdn.jsdelivr.net/npm/zebra_datepicker@1.9.6/dist/zebra_datepicker.min.js'
        , ROOT + 'assets/css/spectreBottom.css'
    ]
});

depp.require(['scripts'], function() {
    depp.define({
        'webAdmin': [
            '/assets/js/db.js'
            , '/assets/webAdmin/WebAdmin.js'
        ]
    });
});

depp.require(['webAdmin'], function() {
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
            , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
        ]
    });
});

depp.require(['fonts']);