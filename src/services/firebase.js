import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyC77CKwGOdbyaoiOK-zyUgTSniMIVmzJDY",
  authDomain: "salgados-da-ge.firebaseapp.com",
  projectId: "salgados-da-ge",
  storageBucket: "salgados-da-ge.appspot.com",
  messagingSenderId: "571315167953",
  appId: "1:571315167953:web:b5ee94c4d9417f33f9dbf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);