import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import { getUserPosts, getUser, getUsernameFromUid } from "../userUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid } = await getUser(req, res);
  let postUid = req.body.postUid;

  try {
    await db
      .collection("users")
      .doc(uid)
      .collection("drafts")
      .doc(postUid)
      .delete();
  } catch (error) {
    console.log(error);
  }

  let posts = await getUserPosts(uid);
  res.send(posts);
  return;
};
