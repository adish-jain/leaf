import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUidFromEmail } from "../userUtils";
const admin = require("firebase-admin");
const firebase = require("firebase/app");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let body = req.body;
  let email = body.email;
  let uid;
};
