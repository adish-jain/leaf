import { initFirebaseAdmin, initFirebase } from "./initFirebase";
const admin = require("firebase-admin");
initFirebaseAdmin();
import fetch from "isomorphic-fetch";
import { NextApiRequest, NextApiResponse } from "next";
let db = admin.firestore();
import {
  setTokenCookies,
  removeTokenCookies,
} from "./cookieUtils";

type GetUserType = {
  uid: string;
  userRecord: any;
};

// Returns the userRecord based on session cookie
// updates the response cookies if expired token
export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<GetUserType> {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;
  try {
    let decodedToken = await admin.auth().verifyIdToken(userToken);
    let uid = decodedToken.uid;
    let userRecord = await admin.auth().getUser(uid);
    handleLoginCookies(res, userToken, refreshToken);
    return {
      uid,
      userRecord,
    };
  } catch (error) {
    console.log("errored on userToken " + userToken);
    console.log(error);
    switch (error.code) {
      case "auth/argument-error":
        return {
          uid: "",
          userRecord: undefined,
        };
      case "auth/id-token-expired":
        let updatedUserToken = await refreshJWT(refreshToken);
        // try again with refreshed token
        req.cookies.userToken = updatedUserToken;
        req.cookies.refreshToken = refreshToken;
        handleLoginCookies(res, updatedUserToken, refreshToken);
        return getUser(req, res);
      default:
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

export function handleLogoutCookies(res: NextApiResponse) {
  let tokens = ["userToken", "refreshToken", "authed"];
  removeTokenCookies(res, tokens);
  return res;
}

export function handleLoginCookies(
  res: NextApiResponse,
  userToken: string,
  refreshToken: string
) {
  let tokens = [
    {
      tokenName: "userToken",
      token: userToken,
    },
    {
      tokenName: "refreshToken",
      token: refreshToken,
    },
  ];
  setTokenCookies(res, tokens);
  return res;
}

export async function refreshJWT(refreshToken: string) {
  try {
    let response = await fetch(refreshTokenURL, {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
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
  let draftsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .orderBy("createdAt");

  return await draftsRef
    .get()
    .then(function (draftsCollection: any) {
      let results: any[] = [];
      draftsCollection.forEach(function (result: any) {
        let resultsJSON = result.data();
        resultsJSON.id = result.id;
        results.push(resultsJSON);
      });
      results.reverse();
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
}

export async function getUserStepsForDraft(uid: string, draftId: string) {
  let stepsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .collection("steps")
    .orderBy("order");

  return await stepsRef
    .get()
    .then(function (stepsCollection: any) {
      let results: any[] = [];
      stepsCollection.forEach(function (result: any) {
        let resultsJSON = result.data();
        resultsJSON.id = result.id;
        results.push({
          text: resultsJSON.text,
          lines: resultsJSON.lines,
          id: resultsJSON.id,
        });
      });
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
}

export async function adjustStepOrder(uid: string, draftId: string, stepsToChange: any){
  stepsToChange.forEach((element: { id: any; lines: any; text: any; }) => {
    let stepId = element["id"];
    db.collection("users").doc(uid).collection("drafts").doc(draftId).collection("steps").doc(stepId).update({"order": admin.firestore.FieldValue.increment(-1)});
  })
  return;
}
