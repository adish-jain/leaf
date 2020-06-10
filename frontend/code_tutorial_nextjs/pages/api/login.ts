import { NextApiRequest, NextApiResponse } from "next";
import { initFirebase } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";

const firebase = require("firebase/app");
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let data = req.body.data;
  let email = data.email;
  let password = data.password;
  let userToken: string;

  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (userCredential: any) {
      let signedin_user = userCredential.user;
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
        return;
      });
    })
    .catch(function (error: any) {});
};
