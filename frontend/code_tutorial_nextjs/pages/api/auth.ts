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

  return await admin
    .auth()
    .verifyIdToken(userToken)
    .then(function (decodedToken: any) {
      res.statusCode = 200;
      res.send({ authenticated: true });
      return;
    })
    .catch(async function (error: any) {
      switch (error.code) {
        // invalid token
        case "auth/argument-error":
          res.statusCode = 200;
          res.send({ authenticated: false });
          return;
        // token is expired, fetch new one via refreshToken
        case "auth/id-token-expired":
          return await refreshJWT(res, refreshToken);
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

async function refreshJWT(res: NextApiResponse, refreshToken: string) {
  try {
    let response = await fetch(refreshTokenURL, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: "grant_type=refresh_token&refresh_token=" + refreshToken,
    });
    let resJSON = await response.json();
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
    return;
  } catch (error) {
    console.log(error);
    res.statusCode = 200;
    res.send({ authenticated: false });
    return;
  }
}
