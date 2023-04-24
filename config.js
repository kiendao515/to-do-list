

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyDiZ4kNJlcWhHh2AU1R2cP-sjz-Mk7nqOY",
  authDomain: "to-do-list-9953b.firebaseapp.com",
  projectId: "to-do-list-9953b",
  storageBucket: "to-do-list-9953b.appspot.com",
  messagingSenderId: "811908434000",
  appId: "1:811908434000:web:e59cf0a1b66ad180aee955"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}