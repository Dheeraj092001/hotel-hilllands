import admin from "firebase-admin";
import { env } from "./env";
import { logger } from "../lib/logger";

let firebaseApp: admin.app.App;

export function initFirebase(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  try {
    if (
      env.firebase.clientEmail &&
      !env.firebase.clientEmail.startsWith("FILL_") &&
      env.firebase.privateKey &&
      !env.firebase.privateKey.startsWith("FILL_")
    ) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebase.projectId,
          clientEmail: env.firebase.clientEmail,
          privateKey: env.firebase.privateKey,
        }),
      });
      logger.info("Firebase Admin initialized with service account certificate");
    } else {
      firebaseApp = admin.initializeApp({
        projectId: env.firebase.projectId || "newlands-shimla",
      });
      logger.info("Firebase Admin initialized in project-id default mode");
    }
  } catch (err: any) {
    logger.warn(`Firebase Admin dev mode warning: ${err.message}`);
    // If app already exists, reuse it
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0]!;
    }
  }

  return firebaseApp;
}

export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) return initFirebase();
  return firebaseApp;
}

export const firebaseAuth = () => getFirebaseAdmin().auth();
