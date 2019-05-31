var responces = [];

depp.define({
    'fb': [
        '#polly-core-req'
        , '#firestore'
    ],
    'scripts': [
        '#fb'
        , '#jquery'
        , '#gridformsJS'
        , '#zebraDate'
        , ROOT + 'assets/css/spectreBottom.css'
    ],
    'httpRPC': [
        , '#RPC'
    ],
    'webAdmin': [
        '#scripts'
        ,'#httpRPC'
        ,'/assets/js/db.js'
        , '/assets/webAdmin/WebAdmin.js'
    ],
    'edit': [
        '#webAdmin',
        '/assets/js/edit.js'
    ]
    , 'general': [
        '#edit'
        , '/assets/js/general.js'
        ,'/assets/js/login.js'
    ],
    'rw': [
        '#general',
        '/assets/js/ui.js'
    ],
    'fonts': [
        '#rw'
        , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);