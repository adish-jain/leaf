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
    let newContent = {
      order: i,
      type: draftContent[i].type,
      slateContent: draftContent[i].slateContent,
      fileId: draftContent[i].fileId,
      lines: draftContent[i].lines,
      imageUrl: draftContent[i].imageUrl,
    };
    if (draftContent[i].fileId === undefined) {
      delete newContent.fileId;
    }
    if (draftContent[i].lines === undefined) {
      delete newContent.lines;
    }
    if (draftContent[i].imageUrl === undefined) {
      delete newContent.imageUrl;
    }
    let newPromise = docRef.collection("draftContent").add(newContent);
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
    const currentFile = files[i];
    let newFile: backendFileObject = {
      fileName: currentFile.fileName,
      language: currentFile.language,
      code: JSON.stringify(currentFile.code),
      order: currentFile.order,
    };
    let newPromise = docRef
      .collection("files")
      .doc(currentFile.fileId)
      .set(newFile);
    gatherPromise.push(newPromise);
  }
  await Promise.all(gatherPromise);
}
