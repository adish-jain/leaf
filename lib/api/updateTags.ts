import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getDraftTitle } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return handleUpdateTags(req, res);
};

async function handleUpdateTags(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let tags = req.body.tags;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // update tags in firebase
  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .update({ tags: tags });

  let updatedTitle = await getDraftTitle(uid, draftId);
  res.statusCode = 200;
  res.send({ draftTitle: updatedTitle });
  return;
}
