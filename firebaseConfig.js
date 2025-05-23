import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgn-Lj7muV2xweaXs1N5olUzF2e6rKIxE",
  authDomain: "pricesharing-app.firebaseapp.com",
  projectId: "pricesharing-app",
  storageBucket: "pricesharing-app.firebasestorage.app",
  messagingSenderId: "890067229276",
  appId: "1:890067229276:web:a6b136202fa19804b42499",
  measurementId: "G-L9ESRTT4KG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
