// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdAkJH8EPlCFhTWtWtVSSxcu8pQTubtos",
  authDomain: "empvet-85a5a.firebaseapp.com",
  projectId: "empvet-85a5a",
  storageBucket: "empvet-85a5a.appspot.com",
  messagingSenderId: "873477957333",
  appId: "1:873477957333:web:0a863004f553f9ff09a45c",
  measurementId: "G-XDP933HX7Q",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
// export const analytics = getAnalytics(app);

export { app, firestore, auth, storage };
