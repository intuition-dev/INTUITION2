var responces = [];

depp.define({
    'fb': [
        '#polly-core'
        , '#firestore'
    ],
    'scripts': [
        '#fb'
        , '#jquery'
        , '#tabulator'
        , '/assets/3rd/gridforms.js'
        , '//unpkg.com/axios@0.19.0-beta.1/dist/axios.min.js'
        // , '//unpkg.com/http-rpc@0.4.1/httpRPC.min.js'
        , ROOT + 'assets/css/spectreBottom.css'
    ],
    'httpRPC': [
        , '//unpkg.com/http-rpc@0.4.1/httpRPC.min.js'
    ],
    'webAdmin': [
        '#scripts'
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