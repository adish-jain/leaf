import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase, initFirebaseAdmin } from "../initFirebase";
import { setTokenCookies } from "../cookieUtils";
import { userNameErrorMessage, handleLoginCookies } from "../userUtils";
import { request } from "http";

const admin = require("firebase-admin");
const firebase = require("firebase/app");

initFirebase();
initFirebaseAdmin();

let db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let tokenId = requestBody.tokenId;
  let type = requestBody.type; //login or signup
  // console.log(tokenId);

  var credential = await firebase.auth.GoogleAuthProvider.credential(tokenId);
  // console.log(credential);

  let userCredential = await firebase.auth().signInWithCredential(credential);
  // console.log(userCredential);

  let signedin_user = userCredential.user;
  // console.log(signedin_user);

  if (type === "signup") {
    let currentUser = await firebase.auth().currentUser;
    console.log(currentUser);
  
    // await currentUser.sendEmailVerification();
  
    let username = currentUser.displayName;
  
    db.collection("users").doc(signedin_user.uid).set({
      email: signedin_user.email,
      username: username,
    });
  }

  let userToken = await signedin_user.getIdToken();
  let refreshToken = signedin_user.refreshToken;
  handleLoginCookies(res, userToken, refreshToken);
  res.status(200).end();
};
