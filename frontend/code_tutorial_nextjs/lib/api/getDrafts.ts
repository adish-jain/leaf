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
  return getDraftsHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function getDraftsHandler(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;

  let { uid } = await getUser(userToken, refreshToken);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let results = await getUserDrafts(uid);
  res.statusCode = 200;
  res.send(results);
  return;
}
