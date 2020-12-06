import { NextApiRequest, NextApiResponse } from "next";
import "firebase";
import { initFirebaseAdmin } from "../initFirebase";
import { getDraftContent } from "../postUtils";

import { Node } from "slate";
import { ContentBlockType } from "../../typescript/enums/backend/postEnums";

const admin = require("firebase-admin");
import { getUser, getUsernameFromUid } from "../userUtils";
import { firestore } from "firebase";
initFirebaseAdmin();
const shortId = require("shortid");
let db: firestore.Firestore = admin.firestore();

const slateNode: Node[] = [
  {
    type: "default",
    children: [
      {
        text: "Start editing here",
      },
    ],
  },
];

export default async function addDraftContentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid } = await getUser(req, res);
  let draftId = req.body.draftId;
  const backendDraftBlockEnum: string = req.body.backendDraftBlockEnum;
  const atIndex: number = req.body.atIndex;
  const backendId: string = req.body.backendId;

  let newContent;
  switch (backendDraftBlockEnum) {
    case ContentBlockType.Text:
      newContent = {
        order: atIndex + 1,
        type: backendDraftBlockEnum,
        slateContent: JSON.stringify(slateNode),
      };
    case ContentBlockType.CodeSteps:
      newContent = {
        order: atIndex + 1,
        type: backendDraftBlockEnum,
        slateContent: JSON.stringify(slateNode),
        fileId: null,
        lines: null,
      };
    default:
      newContent = {
        order: atIndex + 1,
        type: backendDraftBlockEnum,
        slateContent: JSON.stringify(slateNode),
      };
  }

  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .doc(backendId)
    .set(newContent);

  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .orderBy("order")
    .get()
    .then(function (draftContentCollection) {
      // increment every document after the desired order to make room for the new content
      draftContentCollection.docs.forEach(function (draftContentQuery) {
        const currentDocOrder = draftContentQuery.data().order;
        if (currentDocOrder >= atIndex + 1) {
          draftContentQuery.ref.set(
            {
              order: currentDocOrder + 1,
            },
            { merge: true }
          );
        }
      });
    });

  res.statusCode = 200;
  res.end();
  return;
}
