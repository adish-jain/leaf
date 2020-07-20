import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
import { getDraftDataHandler } from "../postUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return changeFileLanguageHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function changeFileLanguageHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let fileId = req.body.fileId;
  let language = req.body.language;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update language for file in firebase
  await db.collection("users")
  .doc(uid)
  .collection("drafts")
  .doc(draftId)
  .collection("files")
  .doc(fileId)
  .update({ "language": language }); 
  
  res.statusCode = 200;
  let results = await getDraftDataHandler(uid, draftId);
  res.send(results);
  return;
}
