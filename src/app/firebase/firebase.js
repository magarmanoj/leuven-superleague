// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAzXfXzNi96vO5KwyG_ygbYeaRgc4LZT58",
    authDomain: "leuvensuperleague2026.firebaseapp.com",
    projectId: "leuvensuperleague2026",
    storageBucket: "leuvensuperleague2026.firebasestorage.app",
    messagingSenderId: "147463187280",
    appId: "1:147463187280:web:d2988dc2220c4c1a659a55",
    measurementId: "G-3XKP0FLVBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbContext = getFirestore(app);
const storage = getStorage(app);

export { auth, dbContext, storage };