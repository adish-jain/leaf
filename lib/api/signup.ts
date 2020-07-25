import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase, initFirebaseAdmin } from "../../lib/initFirebase";
import { checkUsernameDNE } from "../userUtils";
import { setTokenCookies } from "../../lib/cookieUtils";

const admin = require("firebase-admin");
const firebase = require("firebase/app");

initFirebase();
initFirebaseAdmin();

let db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let email = requestBody.email;
  let username = requestBody.username;
  let password = requestBody.password;
  var errored = false;

  // check if username exists
  let unUnique = await checkUsernameDNE(username);
  if (!unUnique) {
    res.json({
      msg: "Username already exists",
    });
    return;
  }
  
  // check if email exists, is malformed, or PW is too weak
  let userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error: any) {
      // console.log("hello world");
      var errorMsg = error.message;
      // console.log(errorMsg);
      res.json({
        msg: errorMsg,
      });
      errored = true;
      return;
    })
   
  if (errored) {
    return;
  }

  let signedin_user = userCredential.user;
  
  let currentUser = await firebase.auth().currentUser;
  // console.log(currentUser);

  await currentUser.sendEmailVerification();
  // console.log(signedin_user.emailVerified);

  // while (currentUser.emailVerified != true) {
  //   await currentUser.reload();
  // }

  db.collection("users").doc(signedin_user.uid).set({
    email: signedin_user.email,
    username: username,
  });

  let userToken = await signedin_user.getIdToken();
  let refreshToken = signedin_user.refreshToken;

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
  res.json({
    msg: "",
  });
  setTokenCookies(res, tokens);
  res.status(200).end();
};
