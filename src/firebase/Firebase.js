// database/firebaseDb.js

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firebase-storage";
require("firebase/auth");

const firebaseConfig = {
  // apiKey: "AIzaSyDAUQaM7Yga9QnwBTwT2MhGa_8mqjpr_Qk",
  // authDomain: "reactnativefirebase-cdec5.firebaseapp.com",
  // databaseURL: "https://reactnativefirebase-cdec5.firebaseio.com",
  // projectId: "reactnativefirebase-cdec5",
  // storageBucket: "reactnativefirebase-cdec5.appspot.com",
  // messagingSenderId: "168175946962",
  // appId: "1:168175946962:web:79842d3801f9df110b710b",
  // measurementId: "G-C641SXZ8J8",

  apiKey: "AIzaSyBj_NI7-AcosLgPegFL1AbTPiruhKeaSvk",
  authDomain: "qsellqbuy-2b0be.firebaseapp.com",
  databaseURL: "https://qsellqbuy-2b0be.firebaseio.com",
  projectId: "qsellqbuy-2b0be",
  storageBucket: "qsellqbuy-2b0be.appspot.com",
  messagingSenderId: "910744912694",
  appId: "1:910744912694:web:ab91def12124f0dc116997",
  measurementId: "G-6TNRZ28C54",
};

if(firebase.apps.length == 0){

firebase.initializeApp(firebaseConfig);

}
export const firestore = firebase.firestore();

export default firebase;
//export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

