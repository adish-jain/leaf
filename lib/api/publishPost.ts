import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkUsernameDNE } from "../userUtils";
import getDrafts from "./getDrafts";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function publishPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let draftId = req.body.draftId;
  let { uid } = await getUser(req, res);
  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let draftsRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId);

  let draftTitle = await draftsRef.get().then(function (draftSnapshot: any) {
    let draftData = draftSnapshot.data();
    return draftData.title;
  });

  let stepsRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps");

  let steps: any[] = [];

  stepsRef
    .get()
    .then(function (stepsCollection: any) {
      stepsCollection.foreach(function (step: any) {
        let stepJSON = step.data();
        steps.push(step.data);
      });
    })
    .catch(function (error: any) {});

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

  // add new post and steps from draft
  db.collection("posts")
    .add(newPost)
    .then(function (postRef: any) {
      for (let i = 0; i < steps.length; i++) {
        db.collection("posts")
          .doc(postRef.id)
          .collection("steps")
          .add(steps[i]);
      }
    });

  // Delete draft
  db.collection("users").doc(uid).collection("drafts").doc(draftId).delete();

  res.end();
  return;
}

export async function getAllPosts() {
  let postsRef = await db.collection("posts").orderBy("createdAt");
  console.log();
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
