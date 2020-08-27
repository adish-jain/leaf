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
    console.log(uid);
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
            console.log(error);
            // An error happened.
          }
        );
    } catch (error) {
      var errorMessage = error.message;
      console.log(errorMessage);
    }
    // .then(async function (firebaseUser: any) {
    //   console.log("sending pw reset email");
    //   await firebase.auth().sendPasswordResetEmail(email)
    //   .catch(function (error: any) {
    //     switch (error.code) {
    //       case "auth/invalid-email":
    //         res.status(403).send({
    //           error: "Email is badly formatted.",
    //         });
    //         return;
    //       case "auth/user-not-found":
    //         res.status(403).send({
    //           error: "This email doesn't exist in the Leaf system.",
    //         });
    //         return;
    //       default:
    //         console.log(error);
    //         res.status(403).send({
    //           error: "Password Reset failed",
    //         });
    //     }
    //   });
    //   firebase
    //     .auth()
    //     .signOut()
    //     .then(
    //       function () {
    //         // Sign-out successful.
    //         console.log("signed out success");
    //       },
    //       function (error: any) {
    //         console.log(error);
    //         // An error happened.
    //       }
    //     );
    // })
    // .catch(function (error: any) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorMessage);
    // });
    res.status(200);
    res.end();
    return;
};
