import { initFirebaseAdmin, initFirebase } from "./initFirebase";
import fetch from "isomorphic-fetch";
import { NextApiRequest, NextApiResponse } from "next";
import { setTokenCookies, removeTokenCookies } from "./cookieUtils";
import { timeStamp } from "../typescript/types/app_types";

const admin = require("firebase-admin");
initFirebaseAdmin();
let db = admin.firestore();

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

        //published posts have published set to true, so we ignore these
        if (!resultsJSON.published) {
          resultsJSON.id = result.id;
          results.push(resultsJSON);
        }
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

export async function getUidFromEmail(email: string) {
  let userRef = db.collection("users").where("email", "==", email);
  let uid = await userRef.get().then(function (userSnapshot: any) {
    let user = userSnapshot.docs[0];
    return user.id;
  });
  return uid;
}

export async function getUserPosts(uid: string) {
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

        //published posts have published set to true, so we include these
        if (resultsJSON.published) {
          resultsJSON.id = result.id;
          results.push(resultsJSON);
        }
      });
      results.reverse();
      return results;
    })
    .catch(function (error: any) {
      console.log(error);
      return [];
    });
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

export async function checkUsernameDNE(username: string): Promise<boolean> {
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
This function only checks emails in Firestore.
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

/*
Checks if an email exists or not in our system.
Check emails in Firestore & emails that were 
once used for authentication and are still linked
to accounts (i.e. Google emails). 
*/
export async function checkEmailAuthDNE(email: string) {
  let emailDNE = await admin
    .auth()
    .listUsers(1000)
    .then(function (userRecords: any) {
      let flag = true;
      userRecords.users.forEach(function (user: any) {
        user.providerData.forEach(function (provider: any) {
          if (provider.email === email) {
            if (provider.providerId === "password") {
              flag = false;
            } else if (notNewAccount(user.metadata.creationTime)) {
              flag = false;
            } 
          }
        });
      })
      return flag;
    })
    .catch((error: any) => {
      console.log(error)
    });
  return emailDNE;
}

/* 
Checks to see if the account creation was within 
the past thirty seconds. This is because Google sign-ups
will be list emails used to sign up as 
part of the auth provider load as soon as we make 
a credential. We don't consider that email when checking
if the email exists or not upon account creation.
*/
function notNewAccount(creationTime: any) {
  let currTime = convertDateToUTC(new Date());
  creationTime = convertDateToUTC(new Date(creationTime));
  let THIRTY_SECONDS = 1 * 30 * 1000;
  return (currTime.valueOf() - creationTime.valueOf()) > THIRTY_SECONDS;
}

function convertDateToUTC(date: any) { 
  return new Date(
    date.getUTCFullYear(), 
    date.getUTCMonth(), 
    date.getUTCDate(), 
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  ); 
}

export async function getDraftTitle(uid: string, draftId: string) {
  let draftData = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .get();
  let title = draftData.data().title;
  return title;
}

export async function userNameErrorMessage(username: string) {
  function isNotValid(username: string) {
    return /[\s~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username);
  }
  let unUnique = await checkUsernameDNE(username);
  if (username.length > 30) {
    return "Username cannot be longer than 30 characters";
  } else if (username.length < 6) {
    return "Username is too short";
  } else if (isNotValid(username)) {
    return "Username cannot contain special characters";
  } else if (!unUnique) {
    return "Username taken";
  } else {
    return "";
  }
}
