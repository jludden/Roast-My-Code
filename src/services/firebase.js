import firebase from 'firebase';


const config = {
    apiKey: process.env.REACT_APP_RMC_FIREBASE_KEY,
    authDomain: "rmc-chat.firebaseapp.com",
    databaseURL: "https://rmc-chat.firebaseio.com"
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();