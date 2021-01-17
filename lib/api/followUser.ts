import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkEmailAuthDNE, getUidFromUsername } from "../userUtils";
import { profile } from "console";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();
let db = admin.firestore();

export default async function followUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let username = req.body.username;
  let profileUsername = req.body.profileUsername;
  let { uid, userRecord } = await getUser(req, res);
  let profileUid = await getUidFromUsername(profileUsername);
  let errored = false;

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

//   await admin
//     .auth()
//     .updateUser(uid, {
//       numFollowing: profileUsername,
//     })
//     .then()
//     .catch(function(error: any) {
//         res.status(403).send({
//         error: "Profile Follow Failed",
//         });
//         errored = true;
//     });

//   if (errored) {
//     return;
//   }

  await db.collection("users").doc(uid).set(
    {
        numFollowing: admin.firestore.FieldValue.increment(1),
    },
    { merge: true }
  );

  await db.collection("users").doc(profileUid).set(
    {
        numFollowers: admin.firestore.FieldValue.increment(1),
    },
    { merge: true }
  );
  
  await db.collection("users").doc(uid).collection("following").add(
    {
        username: profileUsername,
    },
  );

  await db.collection("users").doc(profileUid).collection("followers").add(
    {
        username: username,
    },
  );

  res.status(200).end();  
  return;
}