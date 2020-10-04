import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getDraftImages } from "../postUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid } = await getUser(req, res);

  let draftId = req.body.draftId;
  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }
  let images = await getDraftImages(uid, draftId);
  console.log(images);
  res.statusCode = 200;
  res.send(images);
};