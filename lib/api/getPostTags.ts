import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getDraftTitle } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let draftId = req.body.draftId;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update tags in firebase
  const tagsRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .get();
  const draftData = tagsRef.data();
  const tags = draftData["tags"];
  res.statusCode = 200;
  res.json(tags);
  return;
};
