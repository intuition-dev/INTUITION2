document.addEventListener("DOMContentLoaded", onDeviceReady, false)

function onDeviceReady() {
    console.info('deviceready')
    depp.done('deviceready')
}

var responces = [];

depp.define({
  'scripts': [
    '//www.gstatic.com/firebasejs/5.9.1/firebase-app.js'
    ,'//www.gstatic.com/firebasejs/5.9.1/firebase-auth.js'
    ,'//www.gstatic.com/firebasejs/5.9.1/firebase-firestore.js'
    ,'//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/js/tabulator.min.js'
    , '//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/css/tabulator.min.css'
    , '//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/css/tabulator_simple.min.css'
    , '/assets/3rd/gridforms.js'
    , '//unpkg.com/axios@0.19.0-beta.1/dist/axios.min.js'
    , '//cdn.jsdelivr.net/npm/zebra_datepicker@latest/dist/css/bootstrap/zebra_datepicker.min.css'
    , '//cdn.jsdelivr.net/npm/zebra_datepicker@1.9.6/dist/zebra_datepicker.min.js'
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
    'general': [
      '/assets/js/general.js'
      ,'/assets/js/login.js'
    ]
  });
});

depp.require(['general'], function() {
  depp.define({
    'rw': [
      '/assets/js/ui.js'
    ]
  });
});

depp.require(['rw']);
