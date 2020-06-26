import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getUserStepsForDraft } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in saveStep");
  return updateStepHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function updateStepHandler(req: NextApiRequest, res: NextApiResponse) {
  let text = req.body.text;
  let stepId = req.body.stepId;
  let draftId = req.body.draftId;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // console.log("user is logged in");

  // update text in firebase
  db.collection("users").doc(uid).collection("drafts").doc(draftId).collection("steps").doc(stepId).update({"text": text}); 
  
  res.statusCode = 200;
  let results = await getUserStepsForDraft(uid, draftId);
  res.send(results);
  return;
}
