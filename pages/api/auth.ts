import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebaseAdmin, initFirebase } from "../../lib/initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import { getUser, refreshJWT } from "../../lib/userUtils";

import { setTokenCookies } from "../../lib/cookieUtils";

initFirebaseAdmin();

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

  let { uid, userRecord } = await getUser(req, res);

  if (userRecord === undefined) {
    res.statusCode = 200;
    res.send({ authenticated: false });
    return;
  }

  res.statusCode = 200;
  res.send({ authenticated: true });
  return;
};
