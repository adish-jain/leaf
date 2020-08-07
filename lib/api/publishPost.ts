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

  // create unique url for new post
  let titleWithDashes = draftTitle
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substr(0, 100);
  let deduplicationId = uid.substr(0, 6);
  let postId = titleWithDashes + "-" + deduplicationId;

  db.collection("users").doc(uid).collection("drafts").doc(draftId).update({
    published: true,
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    postId: postId,
  });

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
