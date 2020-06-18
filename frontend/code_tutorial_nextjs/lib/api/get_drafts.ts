import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../../lib/initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";

let db = admin.firestore();

import { setTokenCookies } from "../../lib/cookieUtils";

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let uid: string;

  try {
    let decodedToken = await admin.auth().verifyIdToken(userToken);
    uid = decodedToken.uid;
  } catch (error) {
    return handleError(res, error);
  }
  let draftsRef = db.collection("users").doc(uid).collection("drafts");
  //   let draftsRef = db.collection("users").get(uid).get("drafts")
  //   .collection("drafts").get()
  //   .orderBy("createdAt");

  return await draftsRef
    .get()
    .then(function (draftsCollection: any) {
      let results: any[] = [];
      draftsCollection.forEach(function (result: any) {
        results.push(result.data());
      });
      console.log(results);
      res.send(results);
      res.statusCode = 200;
      return;
    })
    .catch(function (error: any) {
      return handleError(res, error);
    });
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}
