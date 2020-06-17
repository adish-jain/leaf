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
  let refreshToken = cookies.refreshToken;

  admin
    .auth()
    .verifyIdToken(userToken)
    // Get User UID
    .then(function (decodedToken: any) {
      let uid = decodedToken.uid;

      // Get User JSON
      admin
        .auth()
        .getUser(uid)
        .then(function (userRecord: any) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully fetched user data:", userRecord.toJSON());
        })
        .catch(function (error: any) {
          console.log("Error fetching user data:", error);
        });
    })
    .catch(function (error: any) {
      console.log(error);
    });

  res.statusCode = 200;
  res.send({ test: "test" });
};
