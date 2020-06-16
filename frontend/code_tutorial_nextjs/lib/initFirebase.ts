const firebase = require("firebase/app");
import "firebase/auth";

const admin = require("firebase-admin");

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  serviceAccountId: process.env.FIREBASE_CLIENT_EMAIL,
};

const adminConfig = {
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp(adminConfig);
  }
}

export function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
}

export default {
  initFirebase,
  initFirebaseAdmin,
};
