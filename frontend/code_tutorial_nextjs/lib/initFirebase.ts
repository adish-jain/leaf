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

function createAdminConfig() {
  if (process.env.FIREBASE_PRIVATE_KEY === undefined) {
    console.log("firebase private key not set!");
    return {};
  }

  const adminConfig = {
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.CLIENT_CERT_URL,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  };

  return adminConfig;
}

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp(createAdminConfig());
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
