import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTYQeORo_KJFqRxlU_75pwr5wFgrycdE0",
  authDomain: "muhurzen.firebaseapp.com",
  projectId: "muhurzen",
  storageBucket: "muhurzen.firebasestorage.app",
  messagingSenderId: "232013232645",
  appId: "1:232013232645:web:76c971b94341666752fa6c",
  measurementId: "G-MHL4JKNG6T",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
