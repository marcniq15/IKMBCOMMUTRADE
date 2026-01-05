import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// =================================================================
// !! ACTION REQUIRED !!
// TODO: Replace the object below with your app's real Firebase configuration
// from the Firebase Console -> Project settings.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBMhsgoVtmMnrLC25My8hOw6aRL1Pf0wLI",
    authDomain: "ikmbcommutrade-ce94b.firebaseapp.com",
    projectId: "ikmbcommutrade-ce94b",
    storageBucket: "ikmbcommutrade-ce94b.firebasestorage.app",
    messagingSenderId: "696786214001",
    appId: "1:696786214001:web:3d15644e2b3031824f4fd0",
    measurementId: "G-DDCMN9DZWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT the Firebase services so other files can use them
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);