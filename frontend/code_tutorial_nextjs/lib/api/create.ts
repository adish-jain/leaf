import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../../lib/initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";

let db = admin.firestore();

import { setTokenCookies } from "../../lib/cookieUtils";
import { getCurrentTimeWithTZ } from "../../lib/dateUtils";

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cookies = req.cookies;
  let userToken = cookies.userToken;

  admin
    .auth()
    .verifyIdToken(userToken)
    // Get User UID
    .then(async function (decodedToken: any) {
      let uid = decodedToken.uid;
      let userRecord = await admin.auth().getUser(uid);

      let newDraft = {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        title: "Untitled",
      };

      db.collection("users").doc(uid).collection("drafts").add(newDraft);
    })
    .catch(function (error: any) {
      console.log(error);
    });

  res.statusCode = 200;
  res.send({ test: "test" });
};
