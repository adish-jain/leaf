import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
import { backendFileObject } from "../../typescript/types/backend/postTypes";
import FileName from "../../components/FileName";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, fileId, language, order, draftId, fileName } = req.body;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  const updatedFile: backendFileObject = {
    fileName: fileName,
    code: code,
    language: language,
    order: order,
  };

  if (!order) {
    delete updatedFile["order"];
  }
  if (!fileName) {
    delete updatedFile["fileName"];
  }
  if (!code) {
    delete updatedFile["code"];
  }
  if (!language) {
    delete updatedFile["language"];
  }

  // update code for file in firebase
  db.collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .doc(fileId)
    .set(updatedFile, { merge: true });

  res.statusCode = 200;
  let results = await getFilesForDraft(uid, draftId);
  res.send(results);
  return;
};
