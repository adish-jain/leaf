import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../../lib/initFirebase";
const admin = require("firebase-admin");

initFirebaseAdmin();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.cookies);
  let cookies = req.cookies;

  let userToken = cookies.userToken;

  await admin
    .auth()
    .verifyIdToken(userToken)
    .then(function (decodedToken: any) {
      let uid = decodedToken.uid;
      res.statusCode = 200;
      console.log("success");
      res.end("Token success");
    })
    .catch(function (error: any) {
        console.log(error);
      res.statusCode = 403;
      res.end();
    });
};
