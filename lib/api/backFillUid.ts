import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getAllPostsHandler, getDraftDataFromPostId } from "../postUtils";
import { getUidFromUsername, getUser, isAdmin } from "../userUtils";
import { firestore } from "firebase";
import {
  contentBlock,
  fileObject,
} from "../../typescript/types/frontend/postTypes";
import { backendFileObject } from "../../typescript/types/backend/postTypes";
import typedAdmin from "firebase-admin";
const admin = require("firebase-admin");
let db: firestore.Firestore = admin.firestore();
initFirebaseAdmin();
initFirebase();

const firebase = import("firebase/app");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { uid, userRecord } = await getUser(req, res);
  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }
  const isAdminResult = await isAdmin(req, res);
  if (!isAdminResult) {
    res.statusCode = 403;
    res.end();
    return;
  }

  await db
    .collection("users")
    .get()
    .then(function (userCollection) {
      userCollection.forEach(async function (userDoc) {
        let uid = userDoc.ref.id;
        const user = await typedAdmin
          .auth()
          .getUser(uid)
          .catch(function (err) {
            // console.log("no user for ", uid);
            return undefined;
          });
        if (!user) {
          return;
        }
        userDoc.ref.update({
          uid: uid,
        });
      });
    });

  res.statusCode = 200;
  res.end();
  return;
};
