import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, checkUsernameDNE } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function setIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let username = req.body.username;
  let unUnique = await checkUsernameDNE(username);
  if (!unUnique) {
    res.statusCode == 200;
    res.send({
      usernameUpdated: false,
    });
    return;
  }

  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  await db.collection("users").doc(uid).set(
    {
      username: username,
    },
    { merge: true }
  );

  res.statusCode = 200;
  res.send({
    usernameUpdated: true,
  });
  return;
}
