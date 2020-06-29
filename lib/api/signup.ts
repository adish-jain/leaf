import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase, initFirebaseAdmin } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";

const admin = require("firebase-admin");
const firebase = require("firebase/app");

initFirebase();
initFirebaseAdmin();

let db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let email = requestBody.email;
  let password = requestBody.password;

  // Promise<UserCredential>
  let userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);

  let signedin_user = userCredential.user;
  db.collection("users").doc(signedin_user.uid).set({
    email: signedin_user.email,
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
