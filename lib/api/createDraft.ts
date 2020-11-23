import { NextApiRequest, NextApiResponse } from "next";
import "firebase";
import { initFirebaseAdmin } from "../initFirebase";
import {
  backendType,
  draftBackendRepresentation,
  timeStamp,
  folderObject,
  fileObject,
} from "../../typescript/types/app_types";
const admin = require("firebase-admin");
import {
  getUser,
  getUserDraftsForLanding,
  getUsernameFromUid,
} from "../userUtils";
var shortId = require("shortid");
initFirebaseAdmin();
import { Node } from "slate";
import { backendDraftBlockEnum } from "../../typescript/enums/app_enums";
let db = admin.firestore();

export default async function createDraftHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid } = await getUser(req, res);
  let username = await getUsernameFromUid(uid);

  let newDraft: draftBackendRepresentation = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    title: "Untitled",
    draftContent: [
      {
        order: 0,
        type: backendDraftBlockEnum.Text,
        slateContent: JSON.stringify(slateNode),
        backendId: "",
      },
    ],
    folders: [],
    files: [
      {
        fileId: shortId.generate(),
        fileName: "untitled",
        language: "text",
        code: "// Write some code here ...",
        order: 0,
      },
    ],
    published: false,
    tags: [],
    username: username,
    errored: false,
  };

  // await db.collection("users").doc(uid).collection("drafts").add(newDraft);
  let docRef = await db.collection("users").doc(uid).collection("drafts").add({
    title: newDraft.title,
    createdAt: newDraft.createdAt,
    published: newDraft.published,
    tags: newDraft.tags,
    username: newDraft.username,
    errored: newDraft.errored,
  });
  await Promise.all([
    docRef.collection("draftContent").add({
      order: 0,
      type: backendDraftBlockEnum.Text,
      slateContent: JSON.stringify(slateNode),
    }),
  ]);

  docRef.collection("files").add(newDraft.files[0]);

  let drafts = await getUserDraftsForLanding(uid);

  res.statusCode = 200;
  res.send(drafts);
  return;
}

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
