var responces = [];

depp.define({
    'fb': [
        '#polly-core-req'
        , '#firestore'
    ],
    'scripts': [
        '#fb'
        , '#jquery'
        , '#tabulator'
        , '#gridformsJS'
        , ROOT + 'assets/css/spectreBottom.css'
    ],
    'httpRPC': [
        , '#RPC'
    ],
    'webAdmin': [
        '#scripts'
        ,'#httpRPC'
        , '/assets/js/adminWebAdmin.js'
    ],
    'general': [
        '#webAdmin'
        , '/assets/js/general.js'
    ],
    'rw': [
        '#general'
        , '/assets/js/login.js'
        , '/assets/js/ui.js'
    ],
    'crud': [
        '#rw'
        , ROOT + 'assets/js/crud.js'
    ],
    'fonts': [
        '#crud'
        , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);