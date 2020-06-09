import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";

import { serialize, parse } from "cookie";

const firebase = require("firebase/app");
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let data = req.body.data;
  let email = data.email;
  let password = data.password;

  let userToken: string;

  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (UserCredential: any) {
      let signedin_user = UserCredential.user;
      let refreshToken = signedin_user.refreshToken;
      signedin_user.getIdToken().then(function (idToken: string) {
        userToken = idToken;

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
      });
    })
    .catch(function (error: any) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      res.status(403).end();
    });
};
