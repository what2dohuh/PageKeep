import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTdBWDXgsy_e5USKj8_0Goj4G0pGov6vU",

  authDomain: "blogit-35fab.firebaseapp.com",

  projectId: "blogit-35fab",

  storageBucket: "blogit-35fab.appspot.com",

  messagingSenderId: "896394109486",

  appId: "1:896394109486:web:065fb42384d8b0adc875bf",

  measurementId: "G-DTFXY5H0RF"

};
console.log(import.meta.env .VITE_APP_FIREBASE_API_KEY)
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {auth, storage,db}
