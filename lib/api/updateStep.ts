import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
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
  let stepid = req.body.stepid;
  let draftid = req.body.draftid;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // console.log("user is logged in");

  // update text in firebase
  db.collection("users").doc(uid).collection("drafts").doc(draftid).collection("steps").doc(stepid).update({"text": text}); 
  
  res.statusCode = 200;
  let results = "";
  res.send(results);
  return;
}
