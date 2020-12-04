import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");
import { getUser } from "../userUtils";
import { getFilesForDraft } from "../fileUtils";
import { firestore } from "firebase";
let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("in deleteStep");
  return deleteFileHandler(req, res);
};

function handleError(res: NextApiResponse, error: any) {
  console.log(error);
  res.statusCode = 403;
  res.end();
  return;
}

async function deleteFileHandler(req: NextApiRequest, res: NextApiResponse) {
  let draftId = req.body.draftId;
  let fileId = req.body.fileId;
  let { uid } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

  const toDeleteFileOrder: number = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .doc(fileId)
    .get()
    .then(function (docRef) {
      return docRef.get("order");
    });

  // delete file from firebase
  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .doc(fileId)
    .delete();

  await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .orderBy("order")
    .get()
    .then(function (draftContentCollection) {
      // increment every document after the desired order to make room for the new content
      draftContentCollection.docs.forEach(function (draftContentQuery) {
        const currentDocOrder = draftContentQuery.data().order;
        if (currentDocOrder >= toDeleteFileOrder) {
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
  let results = await getFilesForDraft(uid, draftId);
  res.send(results);
  return;
}
