import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import '@firebase/auth';

const firebaseConfig = {};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


export default {
    firebase, db
}