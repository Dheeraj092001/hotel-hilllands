import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuildVerification",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "newlands-shimla.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "newlands-shimla",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "newlands-shimla.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "509368232388",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:509368232388:web:f5aa92c1b3455109cf5c91",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
