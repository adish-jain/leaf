import { initFirebaseAdmin } from "./initFirebase";
const admin = require("firebase-admin");
initFirebaseAdmin();
let db = admin.firestore();

export async function getFilesForDraft(uid: string, draftId: string) {
    let filesRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("files")
    .orderBy("createdAt");

  return await filesRef
    .get()
    .then(function (filesCollection: any) {
      let results: any[] = [];
      filesCollection.forEach(function (result: any) {
        let resultsJSON = result.data();
        resultsJSON.id = result.id;
        results.push({
          id: resultsJSON.id,
          name: resultsJSON.name,
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
