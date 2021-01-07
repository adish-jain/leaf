import { initFirebaseAdmin, initFirebase } from "./initFirebase";
import fetch from "isomorphic-fetch";
import { NextApiRequest, NextApiResponse } from "next";
import { setTokenCookies, removeTokenCookies } from "./cookieUtils";
import { timeStamp } from "../typescript/types/app_types";
import { Post, GetUserType } from "../typescript/types/app_types";
import { fireBasePostType } from "../typescript/types/backend/postTypes";
import {
  fireBaseUserType,
  UserPageProps,
} from "../typescript/types/backend/userTypes";
import { firestore } from "firebase";
import { getPostDataFromFirestoreDoc } from "./postUtils";
const admin = require("firebase-admin");

const dayjs = require("dayjs");
initFirebaseAdmin();
let db: firestore.Firestore = admin.firestore();

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

export async function getUserFromUid(uid: string): Promise<GetUserType> {
  let userRecord = await admin.auth().getUser(uid);
  return {
    uid,
    userRecord,
  };
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

type landingDraft = {
  createdAt: timeStamp;
  title: string;
  id: string;
};

export async function getUserDraftsForLanding(
  uid: string
): Promise<landingDraft[]> {
  let draftsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .orderBy("createdAt");

  return await draftsRef
    .get()
    .then(function (draftsCollection: any) {
      let results: landingDraft[] = [];
      draftsCollection.forEach(function (result: any) {
        let resultsJSON = result.data();

        //published posts have published set to true, so we ignore these
        if (!resultsJSON.published) {
          resultsJSON.id = result.id;
          results.push({
            createdAt: resultsJSON.createdAt,
            title: resultsJSON.title,
            id: resultsJSON.id,
          });
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

export async function getUidFromUsername(username: string): Promise<string> {
  let userRef = db.collection("users").where("username", "==", username);
  let uid = await userRef
    .get()
    .then(function (userSnapshot: any) {
      let user = userSnapshot.docs[0];
      return user.id;
    })
    .catch(function (error) {
      return "";
    });
  return uid;
}

export async function getUidFromDomain(host: string) {
  let uid = await db
    .collection("domains")
    .where("host", "==", host)
    .get()
    .then(async function (snapshot) {
      let data = snapshot.docs[0].data();
      let uid: string = data.uid;
      return uid;
    })
    .catch((error) => {
      return "";
    });
  return uid;
}

export async function getUidFromEmail(email: string): Promise<string> {
  let userRef = db.collection("users").where("email", "==", email);
  let uid = await userRef.get().then(function (userSnapshot: any) {
    let user = userSnapshot.docs[0];
    return user.id;
  });
  return uid;
}

export async function getUserPosts(uid: string): Promise<Post[]> {
  let draftsRef = db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .orderBy("createdAt");

  let posts = await draftsRef
    .get()
    .then(async function (draftsCollection) {
      let results: Post[] = [];
      const gatherPromise: Promise<void>[] = [];
      draftsCollection.forEach(async function (fireStoreDoc) {
        async function getResult() {
          let resultsJSON = fireStoreDoc.data() as fireBasePostType;
          //published posts have published set to true, so we include these
          if (resultsJSON.published) {
            let postResult = await getPostDataFromFirestoreDoc(fireStoreDoc);
            results.push(postResult);
          }
        }
        gatherPromise.push(getResult());
      });
      await Promise.all(gatherPromise);
      results.sort(function (a, b) {
        let keyA = a.publishedAt._seconds,
          keyB = b.publishedAt._seconds;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });

      return results;
    })
    .catch(function (error) {
      console.log(error);
      let result: Post[] = [];
      return result;
    });
  return posts;
}

export async function getProfileData(uid: string): Promise<fireBaseUserType> {
  let userDataReference = await db.collection("users").doc(uid).get();
  let userData = await userDataReference.data();
  if (userData) {
    let result = {
      about: userData.about,
      github: userData.github,
      profileImage: userData.profileImage,
      twitter: userData.twitter,
      website: userData.website,
      email: userData.email,
    };
    return result;
  } else {
    let result = {
      about: "",
      github: "",
      profileImage: "",
      twitter: "",
      website: "",
      email: "",
    };
    return result;
  }
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

export async function getUsernameFromUid(uid: string): Promise<string> {
  let userRef = await db.collection("users").doc(uid);
  let username = await userRef.get().then(function (userSnapshot: any) {
    let data = userSnapshot.data();
    return data.username;
  });
  return username;
}

export async function getProfileImageFromUid(uid: string): Promise<string> {
  let userRef = await db.collection("users").doc(uid);
  let profileImage: string | undefined = await userRef
    .get()
    .then(function (userSnapshot: any) {
      let data = userSnapshot.data();
      return data.profileImage;
    });

  return profileImage || "";
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
      });
      return flag;
    })
    .catch((error: any) => {
      console.log(error);
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
function notNewAccount(creationTime: string) {
  let currTime = new Date();
  let oldTime = new Date(creationTime);
  let THIRTY_SECONDS = 1 * 30 * 1000;
  return currTime.valueOf() - oldTime.valueOf() > THIRTY_SECONDS;
}

export async function getDraftTitle(
  uid: string,
  draftId: string
): Promise<string> {
  let draftData = await db
    .collection("users")
    .doc(uid)
    .collection("drafts")
    .doc(draftId)
    .get();
  let title = draftData.data()?.title || "";
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

export async function authenticateAdmin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { uid, userRecord } = await getUser(req, res);
  let allowedUsers = await db.collection("users").where("admin", "==", true);
  allowedUsers.get().then(function (userCollection) {
    userCollection.forEach(function (checkUser) {
      console.log(checkUser.id);
    });
  });
}

export async function isAdmin(req: NextApiRequest, res: NextApiResponse) {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  // If user is logged out
  if (userToken === undefined) {
    return false;
  }
  let { uid, userRecord } = await getUser(req, res);
  if (uid === "") {
    return false;
  }
  let allowedUsers = await db.collection("users").where("admin", "==", true);
  let isAdmin = false;
  await allowedUsers.get().then(function (userCollection) {
    userCollection.forEach(function (checkUser) {
      if (checkUser.id === uid) {
        isAdmin = true;
      }
    });
  });
  return isAdmin;
}

export async function findUserPageByDomain(
  host: string
): Promise<UserPageProps> {
  let userInfo: UserPageProps = await db
    .collection("domains")
    .where("host", "==", host)
    .get()
    .then(async function (snapshot) {
      let data = snapshot.docs[0].data();
      let uid = data.uid;
      let username = await getUsernameFromUid(uid);
      let profileData = await getProfileData(uid);
      let posts = await getUserPosts(uid);
      let result: UserPageProps = {
        profileUsername: username,
        profileData: profileData,
        uid: uid,
        posts: posts,
        errored: false,
        customDomain: true,
      };
      return result;
    })
    .catch((error) => {
      // console.log(error);
      return {
        profileUsername: "username",
        profileData: {
          email: "",
        },
        uid: "uid",
        posts: [],
        errored: true,
        customDomain: false,
      };
    });
  return userInfo;
}

export async function getUserDataFromUsername(
  username: string
): Promise<UserPageProps> {
  const uid = await getUidFromUsername(username);
  const [posts, profileData] = await Promise.all([
    getUserPosts(uid),
    getProfileData(uid),
  ]);

  let result: UserPageProps = {
    profileUsername: username,
    profileData: profileData,
    errored: false,
    uid: uid,
    posts: posts,
    customDomain: false,
  };
  return result;
}
