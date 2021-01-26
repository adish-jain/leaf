import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getCustomDomainByUsername, getUser, getFollowingFromUid } from "../userUtils";
const admin = require("firebase-admin");
import { firestore } from "firebase";
import { fireBaseUserType } from "../../typescript/types/backend/userTypes";

let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function getUserInfoHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid, userRecord } = await getUser(req, res);
  let userDataReference = await db.collection("users").doc(uid).get();
  let userData = (await userDataReference.data()) as fireBaseUserType;
  const username = userData.username;
  const userHost = await getCustomDomainByUsername(username || "");
  let following = await getFollowingFromUid(uid);

  if (userRecord === undefined) {
    res.end();
    return;
  }
  res.send({
    ...userData,
    email: userRecord.email,
    emailVerified: userRecord.emailVerified,
    userHost,
    following: following,
    uid,
  });
  return;
}
