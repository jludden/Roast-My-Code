// import firebase from 'firebase';
// todo
import firebase from 'firebase/app';
import 'firebase/auth';        
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_RMC_FIREBASE_KEY,
    authDomain: "rmc-chat.firebaseapp.com",
    databaseURL: "https://rmc-chat.firebaseio.com"
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
export const incrementBy = firebase.database.ServerValue.increment;
// export { DataSnapshot } from "firebase/database";
