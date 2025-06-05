import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTGfD7tK_h-oCvhfozUvrXZ4u6dFiz4EA",
  authDomain: "randomquote-76f8c.firebaseapp.com",
  projectId: "randomquote-76f8c",
  storageBucket: "randomquote-76f8c.firebasestorage.app",
  messagingSenderId: "275758652241",
  appId: "1:275758652241:web:984952be01dc95d2f91170",
  measurementId: "G-XL5NKSHSJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 