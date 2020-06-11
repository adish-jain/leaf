import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../../lib/initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";

import { setTokenCookies } from "../../lib/cookieUtils";

initFirebaseAdmin();

const refreshTokenURL =
  "https://securetoken.googleapis.com/v1/token?key=" +
  process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cookies = req.cookies;
  let userToken = cookies.userToken;
  let refreshToken = cookies.refreshToken;

  // If user is logged out
  if (userToken === undefined) {
    res.statusCode = 200;
    res.send({ authenticated: false });
    return;
  }
  // veryifyIdToken
  await admin
    .auth()
    .verifyIdToken(userToken)
    .then(function (decodedToken: any) {
      res.statusCode = 200;
      res.send({ authenticated: true });
      return;
    })
    .catch(function (error: any) {
      switch (error.code) {
        // invalid token
        case "auth/argument-error":
          res.statusCode = 200;
          res.send({ authenticated: false });
          return;
        // token is expired, fetch new one via refreshToken
        case "auth/id-token-expired":
          fetch(refreshTokenURL, {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/x-www-form-urlencoded",
            }),
            body: "grant_type=refresh_token&refresh_token=" + refreshToken,
          })
            .then((refreshRes) => {
              // retrieved new idtoken
              refreshRes.json().then(function (resJSON) {
                let new_token = resJSON.id_token;
                let tokens = [
                  {
                    tokenName: "userToken",
                    token: new_token,
                  },
                ];
                setTokenCookies(res, tokens);
                res.statusCode = 200;
                res.send({ authenticated: true });
              });
            })
            .catch(function (error: any) {
              console.log(error);
              res.statusCode = 200;
              res.send({ authenticated: false });
            });
          break;
        // unhandled firebase error code
        default:
          console.log(error);
          console.log(error.code);
          res.statusCode = 200;
          res.send({ authenticated: false });
          return;
      }
    });
};
