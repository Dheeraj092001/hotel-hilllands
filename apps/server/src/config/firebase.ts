import admin from "firebase-admin";
import { env } from "./env";

let firebaseApp: admin.app.App;

export function initFirebase(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });

  return firebaseApp;
}

export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) return initFirebase();
  return firebaseApp;
}

export const firebaseAuth = () => getFirebaseAdmin().auth();
