import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in deleteStep");
  return deleteStepHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function deleteStepHandler(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;
  let stepid = req.body.stepid;
  let draftid = req.body.draftid;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // console.log("user is logged in");

  // delete step from firebase 
  db.collection("users").doc(uid).collection("drafts").doc(draftid).collection("steps").doc(stepid).delete(); 

  res.statusCode = 200;
  let results = "";
  res.send(results);
  return;
}
