import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser, getUserDrafts } from "../userUtils";
initFirebaseAdmin();

let db = admin.firestore();

async function createDraftHandler(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;

  let { uid, userRecord } = await getUser(userToken, refreshToken);

  let newDraft = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    title: "Untitled",
  };

  db.collection("users").doc(uid).collection("drafts").add(newDraft);

  let drafts = getUserDrafts(uid);

  res.statusCode = 200;
  res.send(drafts);
  return;
}
