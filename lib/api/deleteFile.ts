import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in deleteStep");
  return deleteFileHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function deleteFileHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let fileId = req.body.fileId;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // delete file from firebase
  db.collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .doc(fileId)
    .delete();

  res.statusCode = 200;
  let results = await getFilesForDraft(uid, draftId);
  res.send(results);
  return;
}
