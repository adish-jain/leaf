import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return saveFileHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function saveFileHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let fileId = req.body.fileId;
  let fileName = req.body.fileName;
  let fileCode = req.body.fileCode;
  let fileLang = req.body.fileLang;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let newFile = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    name: fileName,
    code: fileCode,
    language: fileLang,
  };

  await db.collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .doc(fileId)
    .set(newFile);

  res.statusCode = 200;
  let results = await getFilesForDraft(uid, draftId);
  res.send(results);
  return;
}
