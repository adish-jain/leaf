import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getDraftMetadata } from "../postUtils";
let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getDraftMetadataHandler(req, res);
};

async function getDraftMetadataHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let cookies = req.cookies;
  const draftId = req.body.draftId;
  let { uid } = await getUser(req, res);
  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  const metadata = await getDraftMetadata(uid, draftId);
  res.statusCode = 200;
  res.json(metadata);
  return;
}
