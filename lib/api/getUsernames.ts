import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");

initFirebaseAdmin();
initFirebase();
let db = admin.firestore();

export default async function (): Promise<string[]> {
  let usernamesRef = await db
    .collection("users")
    .orderBy("username")
    .select("username")
    .get();
  let usernames = [];

  for (let i = 0; i < usernamesRef.docs.length; i++) {
    usernames.push(usernamesRef.docs[i].get("username"));
  }
  return usernames;
}
