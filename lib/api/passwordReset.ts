import { NextApiRequest, NextApiResponse } from "next";
import { initFirebase } from "../../lib/initFirebase";

const firebase = require("firebase/app");
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let body = req.body;
  let email = body.email;

  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
        // reset email sent
        res.status(200).end();
        return;
    })
    .catch(function (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          res.status(403).send({
            error: "Email is badly formatted.",
          });
          return;
        case "auth/user-not-found":
          res.status(403).send({
            error: "This email doesn't exist in the Leaf system.",
          });
          return;
        default:
          console.log(error);
          res.status(403).send({
            error: "Password Reset failed",
          });
      }
    });
};
