import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "${process.env.REACT_APP_FIREBASE_API_KEY}",
  authDomain: "${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}",
  projectId: "study-budd-4ed3f",
  storageBucket: "${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.REACT_APP_FIREBASE_APP_ID}",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);