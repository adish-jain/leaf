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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("in deleteStep");
  return deleteStepHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function deleteStepHandler(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;
  let stepid = req.body.stepid;
  let draftid = req.body.draftid;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  console.log("user is logged in");
  // console.log(text);

  //delete step from firebase 
  db.collection("users").doc(uid).collection("drafts").doc(draftid).collection("steps").doc(stepid).delete(); 


  res.statusCode = 200;
  let results = "";
  res.send(results);
  return;
  // let results = await getUserDrafts(uid);
  // res.statusCode = 200;
  // res.send(results);
  // return;
}
