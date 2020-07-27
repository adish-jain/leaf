import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkEmailDNE } from "../userUtils";
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
  let emailUnique = await checkEmailDNE(email);
  if (!emailUnique) {
    res.statusCode == 200;
    res.send({
      emailUpdated: false,
    });
    return;
  }

  let { uid, userRecord } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

//   var user = await firebase.auth().currentUser;
//   console.log("user is", user);
//   await user.updateEmail(email).then(function() {
//       console.log("email updated");
//     // Update successful.
//   }).catch(function(error: any) {
//       console.log("email update failed");
//     // An error happened.
//   });

  await admin.auth().updateUser(uid, {
      email: email,
      emailVerified: false
  });

  await db.collection("users").doc(uid).set(
    {
      email: email,
    },
    { merge: true }
  );

  console.log("user record is", userRecord);

  res.statusCode = 200;
  res.send({
    emailUpdated: true,
  });
  return;
}
