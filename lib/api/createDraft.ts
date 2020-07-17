import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser, getUserDrafts } from "../userUtils";
var shortId = require("shortid");
initFirebaseAdmin();

let db = admin.firestore();

export default async function createDraftHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid } = await getUser(req, res);

  let newDraft = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    title: "Untitled",
  };

  let newFileId = shortId.generate();
  let newFile = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    name: "untitled.txt",
    code: "// Write some code here ...",
    language: "jsx",
  }

  await db.collection("users")
          .doc(uid)
          .collection("drafts")
          .add(newDraft);

  let drafts = await getUserDrafts(uid);
  let draftId = drafts[0].id;

  await db.collection("users")
          .doc(uid)
          .collection("drafts")
          .doc(draftId)
          .collection("files")
          .doc(newFileId)
          .set(newFile)

  res.statusCode = 200;
  res.send(drafts);
  return;
}
