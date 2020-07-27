import { initFirebaseAdmin, initFirebase } from "./initFirebase";
const admin = require("firebase-admin");
initFirebaseAdmin();
import fetch from "isomorphic-fetch";
import { NextApiRequest, NextApiResponse } from "next";
let db = admin.firestore();
import { setTokenCookies, removeTokenCookies } from "./cookieUtils";

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
    switch (error.code) {
      case "auth/argument-error":
        console.log(error);
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

export async function getUidFromUsername(username: string) {
  let userRef = db.collection("users").where("username", "==", username);
  let uid = await userRef.get().then(function (userSnapshot: any) {
    let user = userSnapshot.docs[0];
    return user.id;
  });
  return uid;
}

export async function getArticlesFromUsername(username: string) {
  let uid = await getUidFromUsername(username);
  let postsRef = await db.collection("posts").where("uid", "==", uid);
  let results = await postsRef.get().then(function (postsCollection: any) {
    let toReturn: any[] = [];
    postsCollection.forEach(function (result: any) {
      let resultJSON = result.data();
      resultJSON.id = result.id;
      resultJSON.username = username;
      resultJSON.createdAt = resultJSON.createdAt.toDate().toJSON();
      toReturn.push(resultJSON);
    });
    return toReturn;
  });
  return results;
}

export async function getArticlesFromUid(uid: string) {
  let postsRef = await db.collection("posts").where("uid", "==", uid);
  let results = await postsRef.get().then(function (postsCollection: any) {
    let toReturn: any[] = [];
    postsCollection.forEach(function (result: any) {
      let resultJSON = result.data();
      resultJSON.id = result.id;
      resultJSON.createdAt = resultJSON.createdAt.toDate().toJSON();
      toReturn.push(resultJSON);
    });
    return toReturn;
  });
  return results;
}

export async function getUsernameFromUid(uid: string) {
  let userRef = await db.collection("users").doc(uid);
  let username = await userRef.get().then(function (userSnapshot: any) {
    let data = userSnapshot.data();
    return data.username;
  });
  return username;
}

export async function checkUsernameDNE(username: string) {
  let size;

  await db
  .collection("users")
  .where("username", "==", username)
  .get()
  .then(function (snapshot: any) {
    size = snapshot.size;
  });

  if (size === 0) {
    return true;
  } else {
    return false;
  }
}

/*
Not used but keeping in case needed later.
*/
export async function checkEmailDNE(email: string) {
  let size;

  await db
  .collection("users")
  .where("email", "==", email)
  .get()
  .then(function (snapshot: any) {
    size = snapshot.size;
  });

  if (size === 0) {
    return true;
  } else {
    return false;
  }
}
