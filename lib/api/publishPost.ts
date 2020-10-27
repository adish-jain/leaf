import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, getUsernameFromUid } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

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

  // create unique url for new post
  let titleWithDashes = draftTitle
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substr(0, 16);
  titleWithDashes = titleWithDashes.replace(/[^a-zA-Z ]/g, "");
  let deduplicationId = Math.random().toString(36).substring(2, 10);
  let postId = titleWithDashes + "-" + deduplicationId;

  let username = await getUsernameFromUid(uid);
  let newURL = "/" + username + "/" + postId;

  db.collection("users").doc(uid).collection("drafts").doc(draftId).update({
    published: true,
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    postId: postId
  });
  
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
