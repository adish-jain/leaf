import { initFirebaseAdmin } from "./initFirebase";
const admin = require("firebase-admin");
initFirebaseAdmin();
let db = admin.firestore();
import { fileObject } from "../typescript/types/app_types";

export async function getFilesForDraft(
  uid: string,
  draftId: string
): Promise<fileObject[]> {
  let filesRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .orderBy("order");

  return await filesRef
    .get()
    .then(function (filesCollection: firebase.firestore.QuerySnapshot) {
      let results: fileObject[] = [];
      filesCollection.forEach(function (result) {
        let resultsJSON = result.data();
        resultsJSON.id = result.id;
        results.push({
          order: resultsJSON.order,
          fileId: resultsJSON.id,
          fileName: resultsJSON.name,
          code: resultsJSON.code,
          language: resultsJSON.language,
        });
      });
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
}
