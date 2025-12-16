// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACU3XwJQ0X0EvHPnXBjNG7Rqlz6CkcugY",
  authDomain: "prepwise-23662.firebaseapp.com",
  projectId: "prepwise-23662",
  storageBucket: "prepwise-23662.firebasestorage.app",
  messagingSenderId: "690139971182",
  appId: "1:690139971182:web:87322a9e60b5e9812fb07f",
  measurementId: "G-23QB6WZL2N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);