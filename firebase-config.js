import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7FGzfEmo94kxeRXoK6uivnz39LzJsaKc",
  authDomain: "${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}",
  projectId: "study-budd-4ed3f",
  storageBucket: "${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.REACT_APP_FIREBASE_APP_ID}",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app, "gs://study-budd-4ed3f.appspot.com");
export const auth = getAuth(app);
export const db = getFirestore(app);