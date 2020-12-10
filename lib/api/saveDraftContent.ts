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
  const fileId: string | undefined = req.body.fileId;

  let draftContentRef: firebase.firestore.DocumentReference = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .doc(backendId);
  let updateItem = {
    slateContent: slateContent,
    draftId: draftId,
    lines: lines,
    order: order,
    imageUrl: imageUrl,
    fileId: fileId,
  };
  if (imageUrl === undefined) {
    delete updateItem.imageUrl;
  }
  if (order === undefined) {
    delete updateItem.order;
  }
  if (fileId === undefined) {
    delete updateItem.fileId;
  }

  if (slateContent === undefined) {
    delete updateItem.slateContent;
  }
  if (lines === undefined) {
    delete updateItem.lines;
  }
  if (imageUrl === undefined) {
    delete updateItem.imageUrl;
  }
  if (order === undefined) {
    delete updateItem.order;
  }
  if (fileId === undefined) {
    delete updateItem.fileId;
  }

  draftContentRef.set(updateItem, {
    merge: true,
  });

  res.statusCode = 200;
  res.end();
  return;
}

function setNullIfUndefined(value: any) {
  return value === undefined ? null : value;
}
