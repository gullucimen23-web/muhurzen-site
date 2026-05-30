import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTYQeORo_KJFqRxlU_75pwr5wFgrycdE0",
  authDomain: "muhurzen.firebaseapp.com",
  projectId: "muhurzen",
  storageBucket: "muhurzen.firebasestorage.app",
  messagingSenderId: "232013232645",
  appId: "1:232013232645:web:76c971b94341666752fa6c",
  measurementId: "G-MHL4JKNG6T",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
