import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getUserStepsForDraft } from "../postUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in saveStep");
  return updateStepLinesHandler(req, res);
};

/*
 * Updates the file name and line numbers associated with a step.
 */
async function updateStepLinesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let stepId = req.body.stepId;
  let draftId = req.body.draftId;
  let newFileName = req.body.newFileName;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update text in firebase
  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps")
    .doc(stepId)
    .update({
      fileName: newFileName,
    });

  res.statusCode = 200;
  let results = await getUserStepsForDraft(uid, draftId);
  res.send(results);
  return;
}
