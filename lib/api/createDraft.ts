import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser, getUserDrafts } from "../userUtils";
import { updateResponseTokens } from "../../lib/userUtils";
initFirebaseAdmin();

let db = admin.firestore();

export default async function createDraftHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let cookies = req.cookies;

  let { uid } = await getUser(req, res);

  let newDraft = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    title: "Untitled",
  };

  db.collection("users").doc(uid).collection("drafts").add(newDraft);

  let drafts = await getUserDrafts(uid);
  res.statusCode = 200;
  res.send(drafts);
  return;
}
