import { initializeApp } from "firebase/app";
import { getAuth, browserSessionPersistence, setPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3Hb8qmjK4VjvO2gHS6ZYhPZgYTRLhTvo",
  authDomain: "aadona-cms.firebaseapp.com",
  projectId: "aadona-cms",
  storageBucket: "aadona-cms.firebasestorage.app",
  messagingSenderId: "998691072043",
  appId: "1:998691072043:web:2b09f1d3329462dd76626e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Session only - refresh/tab close pe logout
setPersistence(auth, browserSessionPersistence);