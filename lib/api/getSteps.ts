import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUserStepsForDraft, getUser } from "../userUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getStepsHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function getStepsHandler(req: NextApiRequest, res: NextApiResponse) {
  let { uid } = await getUser(req, res);
  let draftid = req.body.draftid;

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let results = await getUserStepsForDraft(uid, draftid);
  res.statusCode = 200;
  res.send(results);
  return;
}
