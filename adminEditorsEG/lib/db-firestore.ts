import { Firebase } from './Firebase';

const firebase = new Firebase();
export let db1 = firebase.get().firestore();

db1.settings({
   timestampsInSnapshots: true
});