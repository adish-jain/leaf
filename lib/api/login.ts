import { NextApiRequest, NextApiResponse } from "next";
import { initFirebase } from "../../lib/initFirebase";
import { handleLoginCookies,  } from "../../lib/userUtils";

const firebase = require("firebase/app");
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let body = req.body;
  let email = body.email;
  let password = body.password;
  let userToken: string;

  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (userCredential: any) {
      let signedin_user = userCredential.user;
      console.log(signedin_user);
      let refreshToken = signedin_user.refreshToken;
      signedin_user.getIdToken().then(function (idToken: string) {
        userToken = idToken;

        handleLoginCookies(res, userToken, refreshToken);
        res.status(200).end();
        return;
      });
    })
    .catch(function (error: any) {
      switch (error.code) {
        case "auth/wrong-password":
          res.status(403).send({
            error:
              "Wrong password. Try again or click Forgot password to reset it.",
          });
          return;
        case "auth/too-many-requests":
          res.status(403).send({
            error: error.message,
          });
          return;
        default:
          console.log(error);
          res.status(403).send({
            error: "Login failed",
          });
      }
    });
};
