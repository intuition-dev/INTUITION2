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
        , ROOT + 'editors/assets/css/spectreBottom.css'
    ],
    'httpRPC': [
        , '#RPC'
    ],
    'webAdmin': [
        '#scripts'
        ,'#httpRPC'
        ,'editors/assets/js/db.js'
        , 'editors/assets/webAdmin/WebAdmin.js'
    ],
    'edit': [
        '#webAdmin',
        'editors/assets/js/edit.js'
    ]
    , 'general': [
        '#edit'
        , 'editors/assets/js/general.js'
        ,'editors/assets/js/login.js'
    ],
    'rw': [
        '#general',
        'editors/assets/js/ui.js'
    ],
    'fonts': [
        '#rw'
        , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);