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
  let errored = false;

  let { uid, userRecord } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  await admin
    .auth()
    .updateUser(uid, {
      password: password
    })
    .then()
    .catch(function(error: any) {
      switch (error.code) {
        case "auth/invalid-password":
          res.status(403).send({
              error: "Password should be longer than 6 characters.",
          });
          errored = true;
          return;
        default:
          console.log(error);
          res.status(403).send({
            error: "Password reset failed",
          });
          errored = true;
      }
    });

  if (errored) {
      return;
  }

  res.status(200).end();  
  return;
}
