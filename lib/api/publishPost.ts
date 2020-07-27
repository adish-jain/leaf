import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkUsernameDNE, getUsernameFromUid } from "../userUtils";
import { getUserStepsForDraft } from "../postUtils";
const shortId = require("shortid");
const admin = require("firebase-admin");
const firebase = require("firebase/app");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

export default async function publishPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let draftId = req.body.draftId;
  let { uid, userRecord } = await getUser(req, res);
  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // if not verified, prevent from publishing
  if (userRecord.emailVerified != true) {
    res.json({
      newURL: "unverified",
    });
    return;
  }

  let draftsRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId);

  // get draft title
  let draftTitle = await draftsRef.get().then(function (draftSnapshot: any) {
    let draftData = draftSnapshot.data();
    return draftData.title;
  });

  let stepsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps");

  let filesRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files");

  let steps: any[] = [];
  let files: File[] = [];

  // gather steps data
  await stepsRef
    .get()
    .then(function (stepsCollection: any) {
      stepsCollection.forEach(function (step: any) {
        let stepJSON = step.data();
        steps.push(stepJSON);
      });
    })
    .catch(function (error: any) {
      // console.log(error);
    });

  // gather files data
  await filesRef.get().then(function (filesCollection: any) {
    filesCollection.forEach(function (file: any) {
      let fileJSON = file.data();
      files.push(fileJSON);
    });
  });

  // create unique url for new post
  let titleWithDashes = draftTitle
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substr(0, 100);
  let deduplicationId = uid.substr(0, 6);
  let postId = titleWithDashes + "-" + deduplicationId;
  let newPost = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    title: draftTitle,
    postId: postId,
    uid: uid,
  };

  // add new post and steps from draft into new post
  db.collection("posts")
    .add(newPost)
    .then(function (postRef: any) {
      for (let i = 0; i < steps.length; i++) {
        db.collection("posts")
          .doc(postRef.id)
          .collection("steps")
          .doc(shortId.generate())
          .set(steps[i]);
      }
      for (let i = 0; i < files.length; i++) {
        db.collection("posts")
          .doc(postRef.id)
          .collection("files")
          .doc(shortId.generate())
          .set(files[i]);
      }
    })
    .catch(function (error: any) {
      console.log(error);
    });

  // Delete draft
  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .delete();
  let username = await getUsernameFromUid(uid);
  let newURL = "/" + username + "/" + postId;
  res.send({
    newURL: newURL,
  });
  return;
}

export async function getAllPosts() {
  let postsRef = await db.collection("posts").orderBy("createdAt");
  let results: any[] = [];
  results = await postsRef.get().then(function (postsCollection: any) {
    postsCollection.forEach(function (result: any) {
      let resultJSON = result.data();
      resultJSON.id = result.id;
      results.push(resultJSON);
    });
    return results;
  });
  return results;
}
