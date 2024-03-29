import { NextApiRequest, NextApiResponse } from "next";
import "firebase";
import { initFirebaseAdmin } from "../initFirebase";
import { getDraftContent } from "../postUtils";
import {} from "../../typescript/types/app_types";
const admin = require("firebase-admin");
import { getUser, getUsernameFromUid } from "../userUtils";
initFirebaseAdmin();

let db = admin.firestore();

export default async function getDraftContentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid } = await getUser(req, res);
  let draftId = req.body.draftId;
  console.log(req.headers.host);
  const draftContent = await getDraftContent(uid, draftId);
  res.statusCode = 200;
  res.json(draftContent);
  return;
}
