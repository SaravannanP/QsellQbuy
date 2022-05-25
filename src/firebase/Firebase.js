// database/firebaseDb.js

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firebase-storage";
require("firebase/auth");

const firebaseConfig = {
 
};

if(firebase.apps.length == 0){

firebase.initializeApp(firebaseConfig);

}
export const firestore = firebase.firestore();

export default firebase;
//export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

