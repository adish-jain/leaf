import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function getUserInfoHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid, userRecord } = await getUser(req, res);
  let userDataReference = await db.collection("users").doc(uid).get();
  let userData = await userDataReference.data();

  // console.log(userData);
  // console.log(userRecord);

  res.send({
    ...userData,
    email: userRecord.email,
    emailVerified: userRecord.emailVerified,
  });
  return;
}
