import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase, initFirebaseAdmin } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";
import { userNameErrorMessage, checkEmailAuthDNE } from "../userUtils";

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

  let errored = false;

  // check if username exists
  let errorMsg = await userNameErrorMessage(username);

  if (!(await checkEmailAuthDNE(email))) {
    errorMsg = "Email already in use.";
  }

  if (errorMsg !== "") {
    res.status(403).send({
      errorMsg: errorMsg,
    });
    return;
  }

  // Promise<UserCredential>
  let userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error: any) {
      errored = true;
      switch (error.code) {
        case "auth/weak-password":
          res.status(403).send({
            errorMsg: "Password should be longer than 6 characters.",
          });
          return;
        case "auth/email-already-in-use":
          res.status(403).send({
            errorMsg: "Email already in use.",
          });
          return;
        case "auth/invalid-email":
          res.status(403).send({
            errorMsg: "Email is badly formatted.",
          });
          return;
        default:
          console.log(error);
          res.status(403).send({
            errorMsg: "Signup failed.",
          });
      }
    });

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
    method: "leaf"
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

  setTokenCookies(res, tokens);
  res.status(200).end();
};
