import { NextApiRequest, NextApiResponse } from "next";
import { initFirebase, initFirebaseAdmin } from "../initFirebase";
import { handleLoginCookies, checkUsernameDNE, getUsernameFromUid, checkEmailAuthDNE } from "../userUtils";

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

  var credential = await firebase.auth.GoogleAuthProvider.credential(tokenId);
  let userCredential = await firebase.auth().signInWithCredential(credential);
  let signedin_user = userCredential.user;

  /*
  Check if this email has been used before for authentication.
  This determines if this Google authentication will be treated
  like a login or a signup.
  */
  if (await checkEmailAuthDNE(signedin_user.email)) {
    let currentUser = await firebase.auth().currentUser;

    /* 
    If user already has set a username, retrieve it. Else, we
    try setting username by using email ID, display name, or combinations
    of these two. If none are valid, we try appending a generatedId 
    to the display name / email ID. If this does happen, 
    user can reset their auto-generated username in settings.
    */
    var username;
    try {
      username = await getUsernameFromUid(signedin_user.uid);
    } catch (e) {
      console.log("Username does not exist.");
    }
    
    if (!(await validate(username))) {
      let indexOfAt = currentUser.email.indexOf("@");
      let emailId = currentUser.email.substring(0, indexOfAt);
      let displayName = currentUser.displayName;
      let generatedId = shortid.generate();

      /* 
      Try making a username out of display name, email ID,
      or combinations of the two
      */
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
        username = "User-" + generatedId;
      }
    }
  
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

/*
Check if the username is valid. To be a valid username:
1. Must not contain special characters
2. Must be at least 6 characters and less than 30 characters
3. Cannot already be taken
*/
async function validate(username: string) {
  try {
    var desired = username.replace(/[\s~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g, '');
    desired = desired.substring(0, 24);
    let usernameDNE = await checkUsernameDNE(desired);
    if (desired.length < 6 || !usernameDNE) { 
      return false;
    }
    return desired;
  } catch (e) {
    return false;
  }
}
