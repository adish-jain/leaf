import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getUserStepsForDraft, adjustStepOrder } from "../postUtils";
import { firestore } from "firebase";
let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console;
  let cookies = req.cookies;
  const { backendId, draftId } = req.body;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  const toDeleteOrder: number = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .doc(backendId)
    .get()
    .then(function (docRef) {
      return docRef.get("order");
    });

  // delete step from firebase
  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .doc(backendId)
    .delete();

  // adjust order of all steps after deleted one
  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("draftContent")
    .orderBy("order")
    .get()
    .then(function (draftContentCollection) {
      // increment every document after the desired order to make room for the new content
      draftContentCollection.docs.forEach(function (draftContentQuery) {
        const currentDocOrder = draftContentQuery.data().order;
        if (currentDocOrder >= toDeleteOrder) {
          draftContentQuery.ref.set(
            {
              order: currentDocOrder - 1,
            },
            { merge: true }
          );
        }
      });
    });

  res.statusCode = 200;
  res.end();
  return;
};
