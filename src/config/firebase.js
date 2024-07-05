import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvKV0Cxh0ePaempnumclvAovzet_kuVTY",
  authDomain: "education-app-1094d.firebaseapp.com",
  projectId: "education-app-1094d",
  storageBucket: "education-app-1094d.appspot.com",
  messagingSenderId: "635391750143",
  appId: "1:635391750143:web:86be0b38522a98e12d41ca",
  measurementId: "G-WSJCB8CEW2",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
