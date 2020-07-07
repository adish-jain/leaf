import { initFirebaseAdmin } from "./initFirebase";
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
  let draftData = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .get();
  let title = draftData.data().title;
  let storedSteps = await getUserStepsForDraft(uid, draftId);
  let results = { title: title, optimisticSteps: storedSteps };
  return results;
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
          id: resultsJSON.id,
        });
      });
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
}

export async function getPostData(username: string, postId: string) {
  let uid = await getUidFromUsername(username);
  let steps = await getStepsFromPost(uid, postId);
}

export async function getPostTitle(uid: string, postId: string) {

}

export async function getPostRef(uid: string, postId: string) {
  let myPostRef = await db
    .collection("posts")
    .where("uid", "==", uid)
    .orderBy("createdAt")
    .get()
    .then(function (postsSnapshot: any) {
      let myPostRef = postsSnapshot.docs[0].ref
        .collection("steps")
        .orderBy("order");
      return myPostRef;
    });

  return myPostRef;
}

export async function getStepsFromPost(uid: string, postId: string) {
  // Get desired post
  let myPostRef = await getPostRef(uid, postId);
  // Get steps from post
  let steps = await myPostRef.get().then(function (stepsCollection: any) {
    let results: any[] = [];
    stepsCollection.forEach(function (result: any) {
      let resultsJSON = result.data();
      resultsJSON.id = result.id;
      results.push({
        text: resultsJSON.text,
        id: resultsJSON.id,
      });
    });
    return results;
  });
  return steps;
}
