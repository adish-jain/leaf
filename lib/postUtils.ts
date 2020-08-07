import { initFirebaseAdmin } from "./initFirebase";
import { getFilesForDraft } from "./fileUtils";
const admin = require("firebase-admin");
initFirebaseAdmin();
let db = admin.firestore();

import { getUidFromUsername } from "./userUtils";

export async function adjustStepOrder(
  uid: string,
  draftId: string,
  stepsToChange: any
) {
  stepsToChange.forEach((element: { id: any; lines: any; text: any }) => {
    let stepId = element["id"];
    db.collection("users")
      .doc(uid)
      .collection("drafts")
      .doc(draftId)
      .collection("steps")
      .doc(stepId)
      .update({ order: admin.firestore.FieldValue.increment(-1) });
  });
  return;
}

export async function getDraftDataHandler(uid: string, draftId: string) {
  try {
    let draftData = await db
      .collection("users")
      .doc(uid)
      .collection("drafts")
      .doc(draftId)
      .get();
    let title = draftData.data().title;
    let storedSteps = await getUserStepsForDraft(uid, draftId);
    let files = await getFilesForDraft(uid, draftId);
    let results = {
      title: title,
      optimisticSteps: storedSteps,
      files: files,
      errored: false,
    };
    return results;
  } catch (error) {
    let results = {
      title: "",
      optimisticSteps: [],
      files: [],
      errored: true,
    };
    return results;
  }
}

export async function getUserStepsForDraft(uid: string, draftId: string) {
  let stepsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps")
    .orderBy("order");

  return await stepsRef
    .get()
    .then(function (stepsCollection: any) {
      let results: any[] = [];
      stepsCollection.forEach(function (result: any) {
        let resultsJSON = result.data();
        resultsJSON.id = result.id;
        results.push({
          text: resultsJSON.text,
          lines: resultsJSON.lines,
          fileName: resultsJSON.fileName,
          id: resultsJSON.id,
          fileId: resultsJSON.fileId
        });
      });
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
}

export async function getDraftDataFromPostId(username: string, postId: string) {
  let uid = await getUidFromUsername(username);
  let draftId = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .where("postId", "==", postId)
    .get()
    .then(function (postsSnapshot: any) {
      let myPostRef = postsSnapshot.docs[0].ref;
      return myPostRef.id;
    });

  return getDraftDataHandler(uid, draftId);
}

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};
