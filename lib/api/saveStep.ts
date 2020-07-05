import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getUserStepsForDraft, maxOrderInSteps } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return saveStepHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function saveStepHandler(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;
  let text = req.body.text;
  let stepId = req.body.stepId;
  let draftId = req.body.draftId;
  let lines = req.body.lines;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // console.log("user is logged in");
  let maxOrderStep = await maxOrderInSteps(uid, draftId);
  // @ts-ignore 
  let order = maxOrderStep[0] ? maxOrderStep[0]["order"] + 1 : 0;

  // store text & lines in firebase
  let stepText = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    text: text,
    lines: lines,
    order: order
  };

  db.collection("users").doc(uid).collection("drafts").doc(draftId).collection("steps").doc(stepId).set(stepText); 
  
  res.statusCode = 200;
  let results = await getUserStepsForDraft(uid, draftId);
  res.send(results);
  return;
}
