import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAvZqH0UM98ERpSBHDnws2UczYfrA0DazM",
    authDomain: "guess-who-f8d88.firebaseapp.com",
    projectId: "guess-who-f8d88",
    storageBucket: "guess-who-f8d88.appspot.com",
    messagingSenderId: "487547304181",
    appId: "1:487547304181:web:17186d907f426167daedbc"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));
