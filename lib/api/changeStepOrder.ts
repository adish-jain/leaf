import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getUserStepsForDraft } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in saveStep");
  return changeStepOrderHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function changeStepOrderHandler(req: NextApiRequest, res: NextApiResponse) {
  let stepId = req.body.stepId;
  let draftId = req.body.draftId;
  let neighborId = req.body.neighborId;
  let oldIdx = req.body.oldIdx;
  let newIdx = req.body.newIdx;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update order in firebase
  db.collection("users").doc(uid).collection("drafts").doc(draftId).collection("steps").doc(stepId).update({"order": newIdx}); 
  db.collection("users").doc(uid).collection("drafts").doc(draftId).collection("steps").doc(neighborId).update({"order": oldIdx}); 

  res.statusCode = 200;
  let results = await getUserStepsForDraft(uid, draftId);
  res.send(results);
  return;
}
