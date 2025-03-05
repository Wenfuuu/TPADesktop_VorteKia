import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAP3RN9n1ZItVe4wCCcdodT9YKJCVhw7mE",
  authDomain: "tpadesktop-f18b5.firebaseapp.com",
  projectId: "tpadesktop-f18b5",
  storageBucket: "tpadesktop-f18b5.firebasestorage.app",
  messagingSenderId: "1002026487065",
  appId: "1:1002026487065:web:7437388896831ea11a4988",
  measurementId: "G-CBM25LEDVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;