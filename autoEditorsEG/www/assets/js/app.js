var responces = [];

depp.define({
  'scripts': [
    'https://www.gstatic.com/firebasejs/5.6.0/firebase-app.js'
    ,'https://www.gstatic.com/firebasejs/5.6.0/firebase-auth.js'
    ,'https://www.gstatic.com/firebasejs/5.6.0/firebase-firestore.js'
    ,'https://cdn.jsdelivr.net/npm/tabulator-tables@4.1.3/dist/js/tabulator.min.js'
    , 'https://cdn.jsdelivr.net/npm/tabulator-tables@4.1.3/dist/css/tabulator.min.css'
    , 'https://cdn.jsdelivr.net/npm/tabulator-tables@4.1.3/dist/css/tabulator_simple.min.css'
    , '/assets/js/gridforms.js'
    , 'https://unpkg.com/axios@0.19.0-beta.1/dist/axios.min.js'
  ]
});

depp.require(['scripts'], function() {
  depp.define({
    'services': [
      '/assets/js/db.js'
      //, '/assets/js/services.js'
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