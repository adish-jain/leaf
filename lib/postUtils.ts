import { initFirebaseAdmin } from "./initFirebase";
import { getFilesForDraft } from "./fileUtils";
initFirebaseAdmin();

const admin = require("firebase-admin");
let db = admin.firestore();

import { getUidFromUsername, getUsernameFromUid } from "./userUtils";
import { timeStamp, Post } from "../typescript/types/app_types";

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
    let published: boolean = draftData.data().published;
    let postId: string = draftData.data().postId;
    let tags = draftData.data().tags;
    let createdAt: timeStamp = draftData.data().createdAt;
    let publishedAt: timeStamp = draftData.data().publishedAt;
    let files = await getFilesForDraft(uid, draftId);
    let username: string = await getUsernameFromUid(uid);
    let results = {
      title: title,
      files: files,
      errored: false,
      published,
      postId,
      tags,
      username,
      createdAt,
      publishedAt,
    };
    return results;
  } catch (error) {
    // console.log(error);
    let results = {
      title: "",
      files: [],
      tags: [],
      errored: true,
      published: false,
      postId: "",
      username: "",
      createdAt: {
        _seconds: 0,
        _nanoseconds: 0,
      },
      publishedAt: {
        _seconds: 0,
        _nanoseconds: 0,
      },
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
          fileId: resultsJSON.fileId,
          imageURL: resultsJSON.imageURL,
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

  let steps = await getUserStepsForDraft(uid, draftId);
  let otherDraftData = await getDraftDataHandler(uid, draftId);

  // merge steps with main draft data
  return { ...otherDraftData, steps };
}

export async function getDraftImages(uid: string, draftId: string) {
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
        if (resultsJSON.imageURL !== undefined) {
          resultsJSON.id = result.id;
          results.push({
            id: resultsJSON.id,
            imageURL: resultsJSON.imageURL,
          });
        }
      });
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
}

export async function getAllPostsHandler() {
  let activeRef = await db.collectionGroup("drafts").where("published", "==", true).get();
  const arr: any[] = [];
  activeRef.forEach((child: any) => arr.push(child));
  var results: Post[] = [];
  for(const doc of arr) {
    let username = await doc.ref.parent.parent.get().then((docSnapshot: any) => {
      return docSnapshot.data().username;
    });
    let resultsJSON = doc.data();
    let postURL = "/" + username + "/" + resultsJSON.postId;
    results.push({
      postId: resultsJSON.postId,
      postURL: postURL,
      title: resultsJSON.title,
      publishedAt: resultsJSON.publishedAt.toDate(),
      tags: resultsJSON.tags,
      username: username,
    });
  }
  // sort by published date
  results.sort(function(a: Post, b: Post) {
    var keyA = a.publishedAt,
      keyB = b.publishedAt;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return results;
}
