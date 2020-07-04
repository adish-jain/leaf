import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkUsernameDNE } from "../userUtils";
import getDrafts from "./getDrafts";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export async function getArticlesFromUsername(username: string) {
  let userRef = db.collection("users").where("username", "==", username);
  let uid = await userRef.get().then(function (userSnapshot: any) {
    let user = userSnapshot.docs[0];
    return user.id;
  });
  let postsRef = await db.collection("posts").where("uid", "==", uid);
  let results = await postsRef.get().then(function (postsCollection: any) {
    let toReturn: any[] = [];
    postsCollection.forEach(function (result: any) {
      let resultJSON = result.data();
      resultJSON.id = result.id;
      resultJSON.createdAt = resultJSON.createdAt.toDate().toJSON();
      toReturn.push(resultJSON);
    });
    return toReturn;
  });
  return results;
}

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

  console.log("drafttitle is", draftTitle);

  let stepsRef = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps");
  //   console.log(draftRef);

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

  res.end();
  return;
}

export async function getUsernameFromUid(uid: string) {
  let userRef = await db.collection("users").doc(uid);
  let username = await userRef.get().then(function (userSnapshot: any) {
    let data = userSnapshot.data();
    return data.username;
  });
  return username;
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
