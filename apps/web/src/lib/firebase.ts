import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey && !apiKey.startsWith("FILL_") ? apiKey : "AIzaSyBK_FbSalNL0RQ-_IG46wiqJtVGY5aUzp0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "newlands-shimla.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "newlands-shimla",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "newlands-shimla.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "509368232388",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:509368232388:web:f5aa92c1b3455109cf5c91",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DZK4KJX36S",
};

let app: any;
let auth: Auth;
let isMockAuth = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error: any) {
  console.warn("Firebase Auth initialization note (running in resilient preview mode):", error?.message || error);
  isMockAuth = true;

  // Resilient fallback auth object so the entire frontend runs smoothly
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Defer to next tick to match async behavior
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signOut: async () => {},
  } as unknown as Auth;
}

export { auth, isMockAuth };
export const googleProvider = new GoogleAuthProvider();

// Analytics only in browser for valid production apps
if (typeof window !== "undefined" && import.meta.env.PROD && app && !isMockAuth) {
  try {
    getAnalytics(app);
  } catch {
    // Non-blocking
  }
}

export default app;
