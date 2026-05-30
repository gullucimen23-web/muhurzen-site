import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTYQeORo_KJFqRxlU_75pwr5wFgrycdE0",
  authDomain: "muhurzen.firebaseapp.com",
  projectId: "muhurzen",
  storageBucket: "muhurzen.firebasestorage.app",
  messagingSenderId: "232013232645",
  appId: "1:232013232645:web:76c971b94341666752fa6c",
  measurementId: "G-MHL4JKNG6T",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
