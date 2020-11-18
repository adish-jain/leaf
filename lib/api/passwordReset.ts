import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUidFromEmail } from "../userUtils";
const admin = require("firebase-admin");
const firebase = require("firebase/app");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let body = req.body;
  let email = body.email;
  let uid;

  try {
    uid = await getUidFromEmail(email);
  } catch (error) {
    res.status(403).send({
      error: "Password Reset failed."
    })
    return;
  };

  let customToken = await admin
    .auth()
    .createCustomToken(uid)
    .then(function (customToken: any) {
      return customToken;
    })
    .catch(function (error: any) {
      console.log("Error creating custom token:", error);
      return "";
    });

  await firebase
    .auth()
    .signInWithCustomToken(customToken)
    try {
      await firebase
        .auth()
        .sendPasswordResetEmail(email);
      await firebase
        .auth()
        .signOut()
        .then(
          function () {
            // Sign-out successful.
            console.log("signed out success");
          },
          function (error: any) {
            // An error happened.
            console.log(error);
          }
        );
    } catch (error) {
      var errorMessage = error.message;
      console.log(errorMessage);
      res.status(403).send({
        error: "Password Reset failed."
      })
      return;
    }
    res.status(200);
    res.end();
    return;
};
