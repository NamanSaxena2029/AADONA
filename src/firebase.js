import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3Hb8qmjK4VjvO2gHS6ZYhPZgYTRLhTvo",
  authDomain: "aadona-cms.firebaseapp.com",
  projectId: "aadona-cms",
  storageBucket: "aadona-cms.firebasestorage.app", // IMPORTANT
  messagingSenderId: "998691072043",
  appId: "1:998691072043:web:2b09f1d3329462dd76626e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app); // IMPORTANT
export const db = getFirestore(app);
