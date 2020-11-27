import { NextApiRequest, NextApiResponse } from "next";
import "firebase";
import { initFirebaseAdmin } from "../initFirebase";
import { getDraftContent } from "../postUtils";
import { Lines } from "../../typescript/types/app_types";
const admin = require("firebase-admin");
import { getUser, getUsernameFromUid } from "../userUtils";
initFirebaseAdmin();

let db = admin.firestore();

export default async function saveDraftContentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid } = await getUser(req, res);
  const draftId: string = req.body.draftId;
  const backendId: string = req.body.backendId;
  const slateContent: string | undefined = req.body.slateContent;
  const lines: Lines | undefined = req.body.lines;
  const imageUrl: string | undefined = req.body.imageUrl;
  const order: number | undefined = req.body.order;

  let draftContentRef: firebase.firestore.DocumentReference = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .doc(backendId);

  let updateItem;
  if (slateContent === undefined) {
    updateItem = {
      draftId: draftId,
      lines: lines || null,
      order: order || null,
      imageUrl: imageUrl || null,
    };
  } else {
    updateItem = {
      slateContent: slateContent,
      draftId: draftId,
      lines: lines || null,
      order: order || null,
      imageUrl: imageUrl || null,
    };
  }

  draftContentRef.set(updateItem, {
    merge: true,
  });

  res.statusCode = 200;
  res.end();
  return;
}
