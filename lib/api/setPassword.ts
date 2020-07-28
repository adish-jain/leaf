import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();

export default async function setPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let password = req.body.password;
  let newPassword = req.body.newPassword;

  let { uid, userRecord } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

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
    let user = firebaseUser.user;
    let cred = firebase.auth.EmailAuthProvider.credential(user.email, password);
    user
    .reauthenticateWithCredential(cred)
    .then(function(){
      admin
        .auth()
        .updateUser(uid, {
          password: newPassword
        })
        .then(function(){
          res.status(200).end();  
          return;
        })
        .catch(function(error: any) {
          switch (error.code) {
            case "auth/invalid-password":
              res.status(403).send({
                  error: "Password should be longer than 6 characters.",
              });
              return;
            default:
              console.log(error);
              res.status(403).send({
                error: "Password reset failed",
              });
          }
        });
    })
    .catch(function(error: any) {
      console.log("incorrect PW");
      res.status(403).send({
        error: "Incorrect current password",
      })
      return;
    }); 

    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        console.log("signed out success");
      })
      .catch(function(error: any) {
      });
  });

  return;
}
