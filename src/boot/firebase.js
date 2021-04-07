import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU2LdLitEznxIkk23OOKcCA-lZv8EAOcY",
    authDomain: "qwitter-3a9b2.firebaseapp.com",
    projectId: "qwitter-3a9b2",
    storageBucket: "qwitter-3a9b2.appspot.com",
    messagingSenderId: "888399454847",
    appId: "1:888399454847:web:81ea9a85b552145059154a"
  
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore()

export default db