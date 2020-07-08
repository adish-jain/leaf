import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import {
  getArticlesFromUsername,
  getUser,
  getUsernameFromUid,
} from "../userUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid } = await getUser(req, res);
  let postUid = req.body.postUid;
  console.log();

  try {
    await db.collection("posts").doc(postUid).delete();
  } catch (error) {
    console.log(error);
  }
  let username = await getUsernameFromUid(uid);
  let posts = await getArticlesFromUsername(username);
  res.send(posts);
  return;
};
