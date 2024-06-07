import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuWf38PT63885rF-OE3co8j-P4_OY4GAg",
  authDomain: "realtime-93fdd.firebaseapp.com",
  projectId: "realtime-93fdd",
  storageBucket: "realtime-93fdd.appspot.com",
  messagingSenderId: "37539022402",
  appId: "1:37539022402:web:9aab68e486622664710fdb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
