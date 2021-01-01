import { NextApiRequest, NextApiResponse } from "next";
import { isAdmin } from "../userUtils";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { firestore } from "firebase";

const admin = require("firebase-admin");
let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const isAdminResult = await isAdmin(req, res);
  res.statusCode = 200;
  res.send({ isAdmin: isAdminResult });
  return;
};
