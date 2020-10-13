import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getAllPostsHandler } from "../postUtils";

let db = admin.firestore();

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let results = await getAllPostsHandler();
  console.log("results are", results);
  res.statusCode = 200;
  res.send(results);
};
