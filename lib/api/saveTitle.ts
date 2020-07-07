import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getUserDrafts } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in saveStep");
  return saveTitleHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function saveTitleHandler(req: NextApiRequest, res: NextApiResponse) {
  let text = req.body.text;
  let draftId = req.body.draftId;
  let title = req.body.title;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update title in firebase
  db.collection("users").doc(uid).collection("drafts").doc(draftId).update({"title": title}); 
  
  res.statusCode = 200;
  let results = await getUserDrafts(uid);
  res.send(results);
  return;
}
