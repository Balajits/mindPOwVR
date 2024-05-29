import { initializeApp } from 'firebase/app';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database";

import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCdCR5tMD_p75P6pRJfRTXJ83IFxrAEWkg",
    authDomain: "mindpowvr.firebaseapp.com",
    projectId: "mindpowvr",
    storageBucket: "mindpowvr.appspot.com",
    messagingSenderId: "894459700519",
    appId: "1:894459700519:web:68e904ce4712b9885cf502",
    measurementId: "G-GZ4F8HENNV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


