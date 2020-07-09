import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import {
  getUsernameFromUid,
  getUser,
  getArticlesFromUsername,
} from "../userUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid } = await getUser(req, res);
  let username = await getUsernameFromUid(uid);
  if (username === undefined) {
    res.send([]);
    return;
  }
  let posts = await getArticlesFromUsername(username);
  res.send(posts);
  return;
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}
