import { initFirebaseAdmin } from "./initFirebase";
import { getFilesForDraft } from "./fileUtils";
import {
  contentBlock,
  draftFrontendRepresentation,
  // publishedPostFrontendRepresentation,
} from "../typescript/types/frontend/postTypes";
import { draftMetaData } from "../typescript/types/frontend/postTypes";

initFirebaseAdmin();
const admin = require("firebase-admin");
let db = admin.firestore();

import {
  getUidFromUsername,
  getUsernameFromUid,
  getProfileImageFromUid,
} from "./userUtils";
import { timeStamp, Post } from "../typescript/types/app_types";
import ErroredPage from "../pages/404";
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

export async function getDraftMetadata(
  uid: string,
  draftId: string
): Promise<draftMetaData> {
  let result: draftMetaData;
  try {
    const [draftRef, username, profileImage] = await Promise.all([
      db.collection("users").doc(uid).collection("drafts").doc(draftId).get(),
      getUsernameFromUid(uid),
      getProfileImageFromUid(uid),
    ]);
    let draftData: draftFrontendRepresentation = draftRef.data();
    let title = draftData.title as string;
    let published: boolean = draftData.published;
    let createdAt: timeStamp = draftData.createdAt;
    let postId: string = draftData.postId || "";
    result = {
      title: title,
      published: published,
      createdAt: createdAt,
      username: username,
      errored: false,
      profileImage: profileImage,
      postId: postId,
    };
  } catch {
    result = {
      title: "title",
      published: false,
      createdAt: {
        _nanoseconds: 0,
        _seconds: 0,
      },
      username: "username",
      errored: true,
      profileImage: "",
    };
  }

  return result;
}

export async function getAllDraftDataHandler(
  uid: string,
  draftId: string
): Promise<draftFrontendRepresentation> {
  try {
    let draftRef = await db
      .collection("users")
      .doc(uid)
      .collection("drafts")
      .doc(draftId)
      .get();
    let draftData: draftFrontendRepresentation = draftRef.data();
    let title = draftData.title as string;
    let published: boolean = draftData.published;
    let tags = draftData.tags as string[];
    let createdAt: timeStamp = draftData.createdAt;
    let publishedAt: timeStamp | undefined = draftData.publishedAt;
    // let privatePost = draftData.privatePost as boolean;
    let likes = draftData.likes;

    const [files, username, draftContent, profileImage] = await Promise.all([
      getFilesForDraft(uid, draftId),
      getUsernameFromUid(uid),
      getDraftContent(uid, draftId),
      getProfileImageFromUid(uid),
    ]);

    let results = {
      title: title,
      draftContent: draftContent,
      folders: [],
      files: files,
      createdAt: createdAt,
      published: published,
      tags: tags,
      username: username,
      errored: false,
      profileImage: profileImage,
      likes: likes,
      private: false,
      publishedAt: publishedAt,
    };
    return results;
  } catch (error) {
    console.log(error);
    let result = {
      title: "",
      draftContent: [],
      folders: [],
      files: [],
      tags: [],
      likes: 0,
      errored: true,
      published: false,
      postId: "",
      username: "",
      profileImage: "",
      createdAt: {
        _seconds: 0,
        _nanoseconds: 0,
      },
      private: false,
    };
    return result;
  }
}

export async function getDraftContent(
  uid: string,
  draftId: string
): Promise<contentBlock[]> {
  let draftContentRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .orderBy("order");
  return await draftContentRef
    .get()
    .then(function (draftContentCollection: firebase.firestore.QuerySnapshot) {
      let results: contentBlock[] = [];
      draftContentCollection.forEach(function (result) {
        let resultsJSON = result.data();
        results.push({
          type: resultsJSON.type,
          slateContent: resultsJSON.slateContent,
          fileId: resultsJSON.fileId as string,
          lines: resultsJSON.lines,
          backendId: result.id,
          imageUrl: resultsJSON.imageUrl,
        });
      });
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
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

  let otherDraftData = await getAllDraftDataHandler(uid, draftId);

  // merge steps with main draft data
  return { ...otherDraftData };
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
  let activeRef = await db
    .collectionGroup("drafts")
    .where("published", "==", true)
    .get();
  const arr: any[] = [];
  activeRef.forEach((child: any) => arr.push(child));
  var results: Post[] = [];
  for (const doc of arr) {
    let username = await doc.ref.parent.parent
      .get()
      .then((docSnapshot: any) => {
        return docSnapshot.data().username;
      });
    let profileImage = await doc.ref.parent.parent
      .get()
      .then((docSnapshot: any) => {
        return docSnapshot.data().profileImage;
      });
    let resultsJSON = doc.data();
    let postURL = "/" + username + "/" + resultsJSON.postId;
    results.push({
      postId: resultsJSON.postId,
      postURL: postURL,
      title: resultsJSON.title,
      publishedAt: resultsJSON.publishedAt.toDate(),
      tags: resultsJSON.tags,
      likes: resultsJSON.likes,
      username: username,
      profileImage: profileImage,
    });
  }
  // sort by published date
  results.sort(function (a: Post, b: Post) {
    var keyA = a.publishedAt,
      keyB = b.publishedAt;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return results;
}
