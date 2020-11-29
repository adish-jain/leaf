import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getUserStepsForDraft } from "../postUtils";
let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return deleteProfileImageHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function deleteProfileImageHandler(req: NextApiRequest, res: NextApiResponse) {
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  // delete img from firebase
  db.collection("users")
    .doc(uid)
    .update({
      profileImage: admin.firestore.FieldValue.delete(),
    });

  res.statusCode = 200;
  res.end();
  return;
}
