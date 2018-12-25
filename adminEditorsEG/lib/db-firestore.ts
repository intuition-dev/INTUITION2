import { Firebase } from './Firebase';

const firebase = new Firebase();

export class DbFirestore {
   db() {
      let db1 = firebase.get().firestore();
      
      db1.settings({
         timestampsInSnapshots: true
      });
   }
}

module.exports = {
   DbFirestore
}