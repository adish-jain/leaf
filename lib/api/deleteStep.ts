import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getDraftDataHandler, adjustStepOrder } from "../postUtils";
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
  let stepId = req.body.stepId;
  let draftId = req.body.draftId;
  let stepsToChange = req.body.stepsToChange;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // delete step from firebase
  await db.collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps")
    .doc(stepId)
    .delete();

  // adjust order of all steps after deleted one
  await adjustStepOrder(uid, draftId, stepsToChange);

  res.statusCode = 200;
  let results = await getDraftDataHandler(uid, draftId);
  res.send(results);
  return;
}
