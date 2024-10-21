// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCnip46_d-kKsvBVWLTvnAgq9RS6oIItug",
    authDomain: "expense-tracker-ba710.firebaseapp.com",
    projectId: "expense-tracker-ba710",
    storageBucket: "expense-tracker-ba710.appspot.com",
    messagingSenderId: "143111586326",
    appId: "1:143111586326:web:640a8c3fe6ef7305846b37"
  };

// const app = initializeApp(firebaseConfig);
//S6.1-- INITIALIZE the APP
const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth };
// export const auth = getAuth(app);