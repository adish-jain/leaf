import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getAllPostsHandler, getDraftDataFromPostId } from "../postUtils";
import { getUidFromUsername, getUser, isAdmin } from "../userUtils";
import { firestore } from "firebase";
import {
  contentBlock,
  fileObject,
} from "../../typescript/types/frontend/postTypes";
import { backendFileObject } from "../../typescript/types/backend/postTypes";

const admin = require("firebase-admin");
let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid, userRecord } = await getUser(req, res);
  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }
  const isAdminResult = await isAdmin(req, res);
  if (!isAdminResult) {
    res.statusCode = 403;
    res.end();
    return;
  }

  const currentOwner = req.body.currentOwner;
  const postId = req.body.postId;
  const newUsername = req.body.newUsername;

  const [originalUid, newUid] = await Promise.all([
    getUidFromUsername(currentOwner),
    getUidFromUsername(newUsername),
  ]);

  const data = await getDraftDataFromPostId(currentOwner, postId);
  let docRef = await db
    .collection("users")
    .doc(newUid)
    .collection("drafts")
    .add({
      title: data.title,
      createdAt: data.createdAt,
      published: data.published,
      publishedAt: data.publishedAt,
      tags: data.tags,
      username: newUsername,
      errored: data.errored,
      likes: data.likes,
      postId: data.postId,
    });
  const draftContent = data.draftContent;
  const files = data.files;
  await Promise.all([
    transferDraftContent(docRef, draftContent),
    transferFileContent(docRef, files),
  ]);

  res.statusCode = 200;
  res.end();
  return;
};

async function transferDraftContent(
  docRef: firestore.DocumentReference<firestore.DocumentData>,
  draftContent: contentBlock[]
) {
  const gatherPromise = [];
  for (let i = 0; i < draftContent.length; i++) {
    let newPromise = docRef.collection("draftContent").add({
      order: i,
      type: draftContent[i].type,
      slateContent: draftContent[i].slateContent,
    });
    gatherPromise.push(newPromise);
  }
  await Promise.all(gatherPromise);
}

async function transferFileContent(
  docRef: firestore.DocumentReference<firestore.DocumentData>,
  files: fileObject[]
) {
  const gatherPromise = [];
  for (let i = 0; i < files.length; i++) {
    let newFile: backendFileObject = {};
    let newPromise = docRef.collection("files").add(newFile);
    gatherPromise.push(newPromise);
  }
  await Promise.all(gatherPromise);
}
