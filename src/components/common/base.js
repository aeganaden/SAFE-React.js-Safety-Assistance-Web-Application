import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDB3sQWVB78v7apv6XIT68RRfT_bq6V_Z0',
  authDomain: 'projectsafe-f609d.firebaseapp.com',
  databaseURL: 'https://projectsafe-f609d.firebaseio.com',
  projectId: 'projectsafe-f609d',
  storageBucket: 'projectsafe-f609d.appspot.com',
  messagingSenderId: '962088955471',
});

const secondaryApp = firebase.initializeApp(
  {
    apiKey: 'AIzaSyDB3sQWVB78v7apv6XIT68RRfT_bq6V_Z0',
    authDomain: 'projectsafe-f609d.firebaseapp.com',
    databaseURL: 'https://projectsafe-f609d.firebaseio.com',
    projectId: 'projectsafe-f609d',
    storageBucket: 'projectsafe-f609d.appspot.com',
    messagingSenderId: '962088955471',
  },
  'Secondary',
);

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp, secondaryApp };

export default base;
