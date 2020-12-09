import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkEmailAuthDNE } from "../userUtils";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();
let db = admin.firestore();

export default async function setProfileHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let about = req.body.about;
  let twitter = req.body.twitter;
  let github = req.body.github;
  let website = req.body.website;
  let { uid, userRecord } = await getUser(req, res);
  let errored = false;

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  await admin
    .auth()
    .updateUser(uid, {
      about: about,
      twitter: twitter,
      github: github,
      website: website,
    })
    .then()
    .catch(function(error: any) {
        res.status(403).send({
        error: "Save Profile Failed",
        });
        errored = true;
    });

  if (errored) {
    return;
  }
  
  await db.collection("users").doc(uid).set(
    {
        about: about,
        twitter: twitter,
        github: github,
        website: website,
    },
    { merge: true }
  );

  res.status(200).end();  
  return;
}