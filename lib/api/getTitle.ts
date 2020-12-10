import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in saveStep");
  return getTitleHandler(req, res);
};

async function getTitleHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let draftData = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .get();
  
  let title;
  try {
    title = draftData.data().title;
  } catch {
    title = "";
  }

  res.statusCode = 200;
  res.send({draftTitle: title});
  return;
}
