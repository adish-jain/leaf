import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getUserDrafts } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return saveCodeHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function saveCodeHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let code = req.body.code;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update code in firebase
  db.collection("users")
  .doc(uid)
  .collection("drafts")
  .doc(draftId)
  .update({"code": code}); 
  
  res.statusCode = 200;
  let results = await getUserDrafts(uid);
  res.send(results);
  return;
}
