import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase, initFirebaseAdmin } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";
import { userNameErrorMessage } from "../userUtils";

const admin = require("firebase-admin");
const firebase = require("firebase/app");

initFirebase();
initFirebaseAdmin();

let db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let googleUser = requestBody.googleUser;
  console.log("entering");
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser: any) {
    unsubscribe();
    if (!isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
        firebase.auth().signInWithCredential(credential).catch(function(error: any) {
            // handle error
        });
    } else {
        console.log("User already signed in");
    }
  });

  function isUserEqual(googleUser: any, firebaseUser: any) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  

//   let signedin_user = userCredential.user;

//   let currentUser = await firebase.auth().currentUser;
//   // console.log(currentUser);

//   await currentUser.sendEmailVerification();
//   // console.log(signedin_user.emailVerified);

//   // while (currentUser.emailVerified != true) {
//   //   await currentUser.reload();
//   // }

//   db.collection("users").doc(signedin_user.uid).set({
//     email: signedin_user.email,
//     username: username,
//   });

//   let userToken = await signedin_user.getIdToken();
//   let refreshToken = signedin_user.refreshToken;

//   let tokens = [
//     {
//       tokenName: "userToken",
//       token: userToken,
//     },
//     {
//       tokenName: "refreshToken",
//       token: refreshToken,
//     },
//   ];

//   setTokenCookies(res, tokens);
  res.status(200).end();
};
