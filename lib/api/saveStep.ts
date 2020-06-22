import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import { getUser } from "../userUtils";

let db = admin.firestore();

import { setTokenCookies } from "../cookieUtils";

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse, text: any) => {
  console.log("in savestep");
  return saveStepHandler(req, res, text);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function saveStepHandler(req: NextApiRequest, res: NextApiResponse, text: any) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;
  let { uid } = await getUser(userToken, refreshToken);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  console.log("user is logged in");
  // console.log(text);

  // store text in firebase
  let stepText = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    text: text,
  };

  // console.log(db.collection("users").doc(uid));
  // update to store in specific draft-id 
  db.collection("users").doc(uid).collection("drafts").add(stepText); 


  res.statusCode = 200;
  let results = "";
  res.send(results);
  return;
  // let results = await getUserDrafts(uid);
  // res.statusCode = 200;
  // res.send(results);
  // return;
}
