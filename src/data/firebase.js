import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBW3AbFQ_CfKebYH1Sosc1cA5otomxYVX0",
  authDomain: "class-unit-calculator.firebaseapp.com",
  projectId: "class-unit-calculator",
  storageBucket: "class-unit-calculator.firebasestorage.app",
  messagingSenderId: "135592606538",
  appId: "1:135592606538:web:1396e20beac2df2b491fb3",
  measurementId: "G-9WLYMY8GKM"
};

const app = initializeApp(firebaseConfig);

export {app}
