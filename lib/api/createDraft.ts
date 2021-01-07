import { NextApiRequest, NextApiResponse } from "next";
import "firebase";
import { initFirebaseAdmin } from "../initFirebase";
import { newFileNode, timeStamp } from "../../typescript/types/app_types";
const admin = require("firebase-admin");
import {
  getUser,
  getUserDraftsForLanding,
  getUsernameFromUid,
} from "../userUtils";
var shortId = require("shortid");
initFirebaseAdmin();
import { Node } from "slate";
import { draftFrontendRepresentation } from "../../typescript/types/frontend/postTypes";
import { ContentBlockType } from "../../typescript/enums/backend/postEnums";
import { slateFade } from "../../styles/framer_animations/opacityFade";
let db = admin.firestore();

export default async function createDraftHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid } = await getUser(req, res);
  let username = await getUsernameFromUid(uid);
  let newDraft = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    title: "Untitled",
    draftContent: [
      {
        order: 0,
        type: ContentBlockType.Text,
        slateContent: JSON.stringify(newFileNode),
      },
    ],
    folders: [],
    files: [
      {
        fileName: "untitled.txt",
        language: "text",
        code: JSON.stringify(newFileNode),
        order: 0,
      },
    ],
    published: false,
    tags: [],
    username: username,
    errored: false,
  };

  let newFirebaseDraft = {
    title: newDraft.title,
    createdAt: newDraft.createdAt,
    published: newDraft.published,
    tags: newDraft.tags,
    username: newDraft.username as string | undefined,
    errored: newDraft.errored,
    likes: 0,
  };
  if (username === "" || username === undefined) {
    delete newFirebaseDraft.username;
  }
  let docRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .add(newFirebaseDraft);
  await Promise.all([
    docRef.collection("draftContent").add({
      order: 0,
      type: ContentBlockType.Text,
      slateContent: JSON.stringify(newFileNode),
    }),
  ]);

  docRef.collection("files").add(newDraft.files[0]);

  let drafts = await getUserDraftsForLanding(uid);

  res.statusCode = 200;
  res.send(drafts);
  return;
}
