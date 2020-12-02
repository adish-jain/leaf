import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getFileHandler(req, res);
};

async function getFileHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let results = await getFilesForDraft(uid, draftId);
  res.send(results);
  return;
}
