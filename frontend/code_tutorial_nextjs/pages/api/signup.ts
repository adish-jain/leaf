import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import initFirebase from "../../lib/initFirebase";
const firebase = require("firebase/app");
initFirebase();

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log("hit api route");
  let data = req.body.data;
  console.log(req.body);
  let email = data.email;
  console.log(email);
  let password = data.password;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (UserCredential: any) {
      console.log("inside then");
      console.log(UserCredential.additionalUserInfo);
      console.log(UserCredential.credential.to_json());
      console.log(UserCredential.user);
    })
    .catch(function (error: any) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
};
