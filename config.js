import firebase from 'firebase';
// import 'firebase/firestore';

var firebaseConfig = {
  apiKey: 'AIzaSyB_SAJdbqLqWNVKMF04n3fPE5JgSpMStx4',
  authDomain: 'the-donor-e9ea1.firebaseapp.com',
  projectId: 'the-donor-e9ea1',
  storageBucket: 'the-donor-e9ea1.appspot.com',
  databaseURL: 'https://the-donor-e9ea1.firebaseio.com',
  messagingSenderId: '2530488275',
  appId: '1:2530488275:web:ade628876f2c2e1c8b0926',
};
// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
