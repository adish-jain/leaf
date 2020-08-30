import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, userNameErrorMessage } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function setIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let username = req.body.username;
  let errorMsg = await userNameErrorMessage(username);
  if (errorMsg !== "") {
    res.statusCode = 200;
    res.send({
      error: errorMsg,
    });
    return;
  }
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.send({
      error: "Username taken",
    });
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

function isValid(username: string) {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username);
}
