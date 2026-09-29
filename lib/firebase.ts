import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjJ8lfL4n7N_-F16f3UcJ1jszdoxzzE6E",
  authDomain: "pool-service-app.firebaseapp.com",
  projectId: "pool-service-app",
  storageBucket: "pool-service-app.firebasestorage.app",
  messagingSenderId: "805880804318",
  appId: "1:805880804318:web:4fd4996088fdfa15b5a34f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
