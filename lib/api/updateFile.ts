import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
import { backendFileObject } from "../../typescript/types/backend/postTypes";
import { fileObject } from "../../typescript/types/frontend/postTypes";

const admin = require("firebase-admin");
import { firestore } from "firebase";

let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { draftId } = req.body;
  const updatedFile: fileObject = req.body.updatedFile;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }
  const backendFile: backendFileObject = {
    fileName: updatedFile.fileName,
    code: JSON.stringify(updatedFile.code),
    language: updatedFile.language,
    order: updatedFile.order,
  };
  // update code for file in firebase
  db.collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .doc(updatedFile.fileId)
    .set(backendFile);

  res.statusCode = 200;
  let results = await getFilesForDraft(uid, draftId);
  res.send(results);
  return;
};
