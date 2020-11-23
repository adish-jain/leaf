import { NextApiRequest, NextApiResponse } from "next";
import "firebase";
import { initFirebaseAdmin } from "../initFirebase";
import { getDraftContent } from "../postUtils";
import {
  backendType,
  draftBackendRepresentation,
  timeStamp,
  folderObject,
  fileObject,
  Lines,
} from "../../typescript/types/app_types";
const admin = require("firebase-admin");
import { getUser, getUsernameFromUid } from "../userUtils";
import { backendDraftBlockEnum } from "../../typescript/enums/app_enums";
initFirebaseAdmin();

let db = admin.firestore();

export default async function saveDraftContentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid } = await getUser(req, res);
  const draftId: string = req.body.draftId;
  const backendId: string = req.body.backendId;
  const slateContent: string = req.body.slateContent;
  const lines: Lines | undefined = req.body.lines;
  const order: number = req.body.order;

  let draftContentRef: firebase.firestore.DocumentReference = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .doc(backendId);
  console.log(backendId);

  draftContentRef.set(
    {
      slateContent: slateContent,
      draftId: draftId,
      lines: lines || null,
      order: order,
    },
    {
      merge: true,
    }
  );

  //   const draftContent = await getDraftContent(uid, draftId);

  res.statusCode = 200;
  res.end();
  //   res.json(draftContent);
  return;
}
