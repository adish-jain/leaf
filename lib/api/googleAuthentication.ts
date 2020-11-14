import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase, initFirebaseAdmin } from "../initFirebase";
import { setTokenCookies } from "../cookieUtils";
import { userNameErrorMessage, handleLoginCookies, checkEmailDNE, checkUsernameDNE, getUsernameFromUid, checkEmailAuthDNE } from "../userUtils";
import { request } from "http";

const admin = require("firebase-admin");
const firebase = require("firebase/app");

initFirebase();
initFirebaseAdmin();

let db = admin.firestore();
const shortid = require("shortid");
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let tokenId = requestBody.tokenId;
  let type = requestBody.type; //login or signup
  // console.log(tokenId);
  var credential = await firebase.auth.GoogleAuthProvider.credential(tokenId);
  console.log("CREDENTIAL IS");
  console.log(credential);

  let userCredential = await firebase.auth().signInWithCredential(credential);
  console.log("USER CREDENTIAL IS");
  console.log(userCredential);

  let signedin_user = userCredential.user;
  console.log("signed in user: ");
  console.log(signedin_user);

  // signedin_user.uid

  // if (type === "signup") {
  // if (await checkUidDNE(signedin_user.uid)) {
  if (await checkEmailAuthDNE(signedin_user.email)) {
    let currentUser = await firebase.auth().currentUser;
    console.log("Current User");
    console.log(currentUser);
  
    // await currentUser.sendEmailVerification();
  
    /* 
      If user has already set a username, retrieve it. Else, we
      try setting username by using email ID, display name, or combinations
      of these two. If none are valid, use auto-generated username if 
      neither email ID nor display name can give valid username. 
      If this does happen, user can reset their auto-generated username in 
      settings.
    */

    var username;
    try {
      username = await getUsernameFromUid(signedin_user.uid);
    } catch (e) {
      console.log("This is not a login, so username dne.");
    }
    
    if (!(await validate(username))) {
      let indexOfAt = currentUser.email.indexOf("@");
      let emailId = currentUser.email.substring(0, indexOfAt);
      let displayName = currentUser.displayName;
      let generatedId = shortid.generate();

      if (await validate(displayName)) {
        username = await validate(displayName);
      } else if (await validate(emailId)) {
        username = await validate(emailId);
      } else if (await validate(emailId + displayName)) {
        username = await validate(emailId + displayName);
      } else if (await validate(displayName + emailId)) {
        username = await validate(displayName + emailId);
      } else if (await validate(displayName + generatedId)) {
        username = await validate(displayName + generatedId);
      } else if (await validate(emailId + generatedId)) {
        username = await validate(emailId + generatedId);
      } else {
        username = "user" + generatedId;
      }
    }
    console.log(username);
  
    db.collection("users").doc(signedin_user.uid).set({
      email: signedin_user.email,
      username: username,
      method: "google"
    });
  }

  let userToken = await signedin_user.getIdToken();
  let refreshToken = signedin_user.refreshToken;
  handleLoginCookies(res, userToken, refreshToken);
  res.status(200).end();
};

async function validate(username: string) {
  try{
    var desired = username.replace(/[\s~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g, '');
    desired = desired.substring(0, 24);
    let usernameDNE = await checkUsernameDNE(desired);
    if (desired.length === 0 || !usernameDNE) { 
      return false;
    }
    return desired;
  } catch (e) {
    console.log("returning false");
    return false;
  }
}
