import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import { getUser } from "../userUtils";
import { getFeedForUser } from "../postUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid } = await getUser(req, res);
  let posts = await getFeedForUser(uid);
  res.send(posts);
  return;
};
