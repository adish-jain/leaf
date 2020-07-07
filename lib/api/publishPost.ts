import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkUsernameDNE, getUsernameFromUid } from "../userUtils";
import getDrafts from "./getDrafts";
const shortId = require("shortid");
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

  let stepsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps");

  let steps: any[] = [];

  await stepsRef
    .get()
    .then(function (stepsCollection: any) {
      stepsCollection.forEach(function (step: any) {
        let stepJSON = step.data();
        console.log(stepJSON);
        steps.push(stepJSON);
      });
    })
    .catch(function (error: any) {
      // console.log(error);
    });

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

  console.log("steps are");
  console.log(steps);
  // add new post and steps from draft
  db.collection("posts")
    .add(newPost)
    .then(function (postRef: any) {
      for (let i = 0; i < steps.length; i++) {
        console.log(postRef.id);
        db.collection("posts")
          .doc(postRef.id)
          .collection("steps")
          .doc(shortId.generate())
          .set(steps[i]);
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
