import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
const admin = require("firebase-admin");
const firebase = require("firebase/app");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function sendEmailVerification(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid, userRecord } = await getUser(req, res);
  let userToken = req.cookies.userToken;
  console.log(userToken);
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
    .then(function (firebaseUser: any) {
      firebaseUser.user.sendEmailVerification()
      .then(function (response: any) {
        res.status(200).end();
        return;
      }) 
      .catch(function (error: any) {
        console.log(error);
        res.status(403).send({
          error: "Email verification has already been sent",
        });
        return;
      })
      firebase
        .auth()
        .signOut()
        .then(
          function () {
            // Sign-out successful.
            console.log("signed out success");
          },
          function (error: any) {
            // An error happened.
          }
        );
    })

    .catch(function (error: any) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
  return;
}
