import { initFirebaseAdmin, initFirebase } from "./initFirebase";
import { getFilesForDraft } from "./fileUtils";
import {
  contentBlock,
  draftFrontendRepresentation,
  serializedContentBlock,
  // publishedPostFrontendRepresentation,
} from "../typescript/types/frontend/postTypes";
import {
  draftMetaData,
  PostPageProps,
} from "../typescript/types/frontend/postTypes";
import { EMPTY_TIMESTAMP } from "../typescript/types/app_types";
import { fireBasePostType } from "../typescript/types/backend/postTypes";
import { ParsedUrlQuery } from "querystring";
import { firestore } from "firebase";
import { GetServerSidePropsContext } from "next";

const admin = require("firebase-admin");
let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();

import {
  getUidFromUsername,
  getUsernameFromUid,
  getProfileImageFromUid,
  getProfileData,
  getUidFromDomain,
} from "./userUtils";
import { timeStamp, Post } from "../typescript/types/app_types";
import ErroredPage from "../pages/404";

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
    let draftData = draftRef.data();
    if (!draftData) {
      throw "undefined draft data";
    }
    let typedDraftData = draftData as draftFrontendRepresentation;
    let title = typedDraftData.title as string;
    let published: boolean = typedDraftData.published;
    let createdAt: timeStamp = typedDraftData.createdAt;
    let postId: string = typedDraftData.postId || "";
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
    let draftData = draftRef.data();
    if (!draftData) {
      throw "undefined draftData";
    }
    let typeDraftData = draftData as draftFrontendRepresentation;
    let title = typeDraftData.title as string;
    let published: boolean = typeDraftData.published;
    let tags = typeDraftData.tags as string[];
    let createdAt: timeStamp = typeDraftData.createdAt;
    let publishedAt: timeStamp | undefined = typeDraftData.publishedAt;
    let postId: string | undefined = typeDraftData.postId;
    // let privatePost = draftData.privatePost as boolean;
    let likes = typeDraftData.likes;

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
      postId: postId,
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

export async function getDraftDataFromPostId(username: string, postId: string) {
  let uid = await getUidFromUsername(username);
  let draftId = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .where("postId", "==", postId)
    .get()
    .then(function (postsSnapshot) {
      let myPostRef = postsSnapshot.docs[0].ref;
      return myPostRef.id;
    });

  let otherDraftData = await getAllDraftDataHandler(uid, draftId);

  // merge steps with main draft data
  return { ...otherDraftData };
}

export async function getPostDataFromPostIdAndDomain(
  host: string,
  postId: string
): Promise<PostPageProps> {
  const uid = await getUidFromDomain(host);
  let draftId = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .where("postId", "==", postId)
    .get()
    .then(function (postsSnapshot) {
      let myPostRef = postsSnapshot.docs[0].ref;
      return myPostRef.id;
    });
  const [postData, profileImage] = await Promise.all([
    getAllDraftDataHandler(uid, draftId),
    getProfileImageFromUid(uid),
  ]);

  const {
    title,
    draftContent: postContent,
    likes,
    tags,
    errored,
    files,
    username,
    publishedAt,
  } = postData;
  let serializedPostContent = serializePostContent(postContent);

  const result: PostPageProps = {
    postContent: serializedPostContent,
    title,
    tags,
    likes: likes ? likes : 0,
    errored,
    files,
    username,
    profileImage,
    publishedAtSeconds: publishedAt?._seconds || 0,
  };

  return result;
}

export function serializePostContent(
  postContent: contentBlock[]
): serializedContentBlock[] {
  let serializedContentBlocks: serializedContentBlock[] = [];
  for (let i = 0; i < postContent.length; i++) {
    let unserializedContent = postContent[i];
    const { fileId, lines, imageUrl } = unserializedContent;
    let serializedContent: serializedContentBlock = {
      ...unserializedContent,
      fileId: fileId ? fileId : null,
      imageUrl: imageUrl ? imageUrl : null,
      lines: lines ? lines : null,
    };
    serializedContentBlocks.push(serializedContent);
  }
  return serializedContentBlocks;
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
  const arr: firestore.QueryDocumentSnapshot<firestore.DocumentData>[] = [];
  activeRef.forEach((child) => arr.push(child));
  var results: Post[] = [];
  try {
    for (const doc of arr) {
      let username = await doc.ref.parent.parent!.get().then((docSnapshot) => {
        return docSnapshot.data()!.username;
      });
      let profileImage = await doc.ref.parent
        .parent!.get()
        .then((docSnapshot) => {
          return docSnapshot.data()!.profileImage;
        });
      let resultsJSON = doc.data();
      results.push({
        postId: resultsJSON.postId,
        title: resultsJSON.title,
        publishedAt: resultsJSON.publishedAt.toDate(),
        tags: resultsJSON.tags,
        likes: resultsJSON.likes,
        username: username,
        profileImage: profileImage,
        createdAt: resultsJSON.createdAt,
        firebaseId: resultsJSON.id,
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
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getPostDataFromFirestoreDoc(
  fireStoreDoc: firestore.QueryDocumentSnapshot<firestore.DocumentData>
): Promise<Post> {
  let resultsJSON = fireStoreDoc.data() as fireBasePostType;
  let firebaseId = resultsJSON.firebaseId;
  let profileImage = await fireStoreDoc.ref.parent
    .parent!.get()
    .then((docSnapshot) => {
      return docSnapshot.data()!.profileImage;
    });

  let username = await fireStoreDoc.ref.parent
    .parent!.get()
    .then((docSnapshot) => {
      return docSnapshot.data()!.username;
    });
  return {
    postId: resultsJSON.postId,
    title: resultsJSON.title,
    publishedAt: resultsJSON.publishedAt
      ? {
          _seconds: resultsJSON.publishedAt._seconds,
          _nanoseconds: resultsJSON.publishedAt._nanoseconds,
        }
      : EMPTY_TIMESTAMP,
    tags: resultsJSON.tags || [],
    likes: resultsJSON.likes || 0,
    username: username,
    profileImage: profileImage,
    createdAt: {
      _seconds: resultsJSON.createdAt._seconds,
      _nanoseconds: resultsJSON.createdAt._nanoseconds,
    },
    firebaseId: firebaseId ? firebaseId : fireStoreDoc.id,
  };
}

export async function getPostDataFromPostIdAndUsername(
  username: string,
  postId: string
): Promise<PostPageProps> {
  const uid = await getUidFromUsername(username);
  let draftId = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .where("postId", "==", postId)
    .get()
    .then(function (postsSnapshot) {
      let myPostRef = postsSnapshot.docs[0].ref;
      return myPostRef.id;
    });
  const [postData, profileImage] = await Promise.all([
    getAllDraftDataHandler(uid, draftId),
    getProfileImageFromUid(uid),
  ]);

  const {
    title,
    draftContent: postContent,
    likes,
    tags,
    errored,
    files,
    publishedAt,
  } = postData;
  let serializedPostContent = serializePostContent(postContent);

  const result: PostPageProps = {
    postContent: serializedPostContent,
    title,
    tags,
    likes: likes ? likes : 0,
    errored,
    files,
    username,
    profileImage,
    publishedAtSeconds: publishedAt?._seconds || 0,
  };

  return result;
}
