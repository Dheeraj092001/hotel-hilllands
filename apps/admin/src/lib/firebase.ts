import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey && !apiKey.startsWith("FILL_") ? apiKey : "AIzaSyBK_FbSalNL0RQ-_IG46wiqJtVGY5aUzp0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "newlands-shimla.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "newlands-shimla",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "newlands-shimla.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "509368232388",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:509368232388:web:f5aa92c1b3455109cf5c91",
};

let app: any;
let auth: Auth;
let isMockAuth = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error: any) {
  console.warn("Firebase Admin Auth note (running in resilient preview mode):", error?.message || error);
  isMockAuth = true;

  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signOut: async () => {},
  } as unknown as Auth;
}

export { auth, isMockAuth };
export default app;
