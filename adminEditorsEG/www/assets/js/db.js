window.firebase.initializeApp(config);

window.auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

window.db1 = window.firebase.firestore();

db1.settings({
   timestampsInSnapshots: true
});