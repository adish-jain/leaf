import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import { getUserDrafts, getUser } from "../userUtils";

let db = admin.firestore();

import { setTokenCookies } from "../cookieUtils";

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let draft_id = req.body.draft_id;
  let userToken = req.cookies.userToken;
  let refreshToken = req.cookies.refreshToken;
  let { uid } = await getUser(req, res);

  try {
    await db
      .collection("users")
      .doc(uid)
      .collection("drafts")
      .doc(draft_id)
      .delete();
  } catch (error) {
    console.log(error);
  }

  let drafts = await getUserDrafts(uid);

  res.statusCode = 200;
  res.send(drafts);
  return;
};
