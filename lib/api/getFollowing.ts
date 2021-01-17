import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import { getFollowingFromUsername, getUser } from "../userUtils";

let db = admin.firestore();

import { setTokenCookies } from "../cookieUtils";

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return getFollowingHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function getFollowingHandler(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;
  let username = req.body.username;

  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  let results = await getFollowingFromUsername(username);

  console.log("RETURNING RESULTS");
  console.log(results);
  res.statusCode = 200;
  res.send(results);
  return;
}
