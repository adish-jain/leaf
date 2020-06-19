import { initFirebaseAdmin, initFirebase } from "./initFirebase";
import { uniqueId } from "lodash";
const admin = require("firebase-admin");
initFirebaseAdmin();
let db = admin.firestore();

type GetUserType = {
  uid: string;
  userRecord: any;
};

export async function getUser(
  userToken: string,
  refreshToken: string
): Promise<GetUserType> {
  try {
    let decodedToken = await admin.auth().verifyIdToken(userToken);
    let uid = decodedToken.uid;

    let userRecord = await admin.auth().getUser(uid);
    return {
      uid,
      userRecord,
    };
  } catch (error) {
    switch (error.code) {
      case "auth/argument-error":
        return {
          uid: "",
          userRecord: undefined,
        };
      case "auth/id-token-expired":
        let new_token = await refreshJWT(refreshToken);
        // try again with refreshed token
        return getUser(new_token, refreshToken);
      default:
        console.log(error);
        return {
          uid: "",
          userRecord: undefined,
        };
    }
  }
}

const refreshTokenURL =
  "https://securetoken.googleapis.com/v1/token?key=" +
  process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY;

export async function refreshJWT(refreshToken: string) {
  try {
    let response = await fetch(refreshTokenURL, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: "grant_type=refresh_token&refresh_token=" + refreshToken,
    });

    let resJSON = await response.json();
    let new_token = resJSON.id_token;
    return new_token;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export async function getUserDrafts(uid: string) {
    let draftsRef = db.collection("users").doc(uid).collection("drafts");
  
    return await draftsRef
      .get()
      .then(function (draftsCollection: any) {
        let results: any[] = [];
        draftsCollection.forEach(function (result: any) {
          results.push(result.data());
        });
        return results;
      })
      .catch(function (error: any) {
        console.log(error);
        return [];
      });
  }