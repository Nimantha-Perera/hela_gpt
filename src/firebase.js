// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0aBHLzGXrStv-kmpTPncAMKO5k86QUt8",
  authDomain: "helagpt.firebaseapp.com",
  databaseURL: "https://helagpt-default-rtdb.firebaseio.com",
  projectId: "helagpt",
  storageBucket: "helagpt.appspot.com",
  messagingSenderId: "189523470100",
  appId: "1:189523470100:web:06827624d648b164c10401",
  measurementId: "G-941Y2M39DK"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); // Initialize Firebase Authentication
const provider = new GoogleAuthProvider(); // Initialize Firebase Authentication with GoogleAuthProvider

export { auth, provider };

