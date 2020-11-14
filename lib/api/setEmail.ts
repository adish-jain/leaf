import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkEmailAuthDNE } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();

export default async function setEmailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let email = req.body.email;
  let { uid, userRecord } = await getUser(req, res);
  let errored = false;

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // check if email exists
  if (!(await checkEmailAuthDNE(email))) {
    let errorMsg = "Email already in use.";
    res.status(403).send({
      error: errorMsg,
    });
    return;
  }

  await admin
    .auth()
    .updateUser(uid, {
      email: email,
      emailVerified: false
    })
    .then()
    .catch(function(error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          res.status(403).send({
            error:
              "Email address is poorly formatted.",
          });
          errored = true;
          return;
        case "auth/email-already-exists":
          res.status(403).send({
            error: "Email already in use.",
          });
          errored = true;
          return;
        default:
          console.log(error);
          res.status(403).send({
            error: "Email reset failed",
          });
          errored = true;
      }
    });

  if (errored) {
    return;
  }
  
  await db.collection("users").doc(uid).set(
    {
      email: email,
    },
    { merge: true }
  );

  res.status(200).end();  
  return;
}
