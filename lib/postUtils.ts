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
    // let code = draftData.data().code;
    // let language = draftData.data().language;
    let storedSteps = await getUserStepsForDraft(uid, draftId);
    let files = await getFilesForDraft(uid, draftId);
    console.log(files);
    let results = { 
      title: title, 
      optimisticSteps: storedSteps, 
      files: files,
      // code: code, 
      // language: language, 
      errored: false 
    };
    return results;
  } catch (error) {
    let results = {
      title: "",
      optimisticSteps: [],
      files: [],
      // code: "",
      // language: "",
      errored: true
    }
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
  try {
    let uid = await getUidFromUsername(username);
    let steps = await getStepsFromPost(uid, postId);
    let title = await getPostTitle(uid, postId);
    return {
      steps,
      title,
      errored: false,
    };
  } catch (error) {
    return {
      steps: [],
      title: "",
      errored: true,
    };
  }
}

export async function getPostTitle(uid: string, postId: string) {
  let myPostRef = await getPostRef(uid, postId);
  let title = await myPostRef.get().then(function (postSnapshot: any) {
    let postData = postSnapshot.data();
    let title = postData.title;
    return title;
  });
  return title;
}

export async function getPostRef(uid: string, postId: string) {
  let myPostRef = await db
    .collection("posts")
    .where("uid", "==", uid)
    .where("postId", "==", postId)
    .orderBy("createdAt")
    .get()
    .then(function (postsSnapshot: any) {
      let myPostRef = postsSnapshot.docs[0].ref;
      return myPostRef;
    });

  return myPostRef;
}

export async function getStepsFromPost(uid: string, postId: string) {
  // Get desired post
  let myPostRef = await getPostRef(uid, postId);

  // Get steps from post
  let steps = await myPostRef
    .collection("steps")
    .orderBy("order")
    .get()
    .then(function (stepsCollection: any) {
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
