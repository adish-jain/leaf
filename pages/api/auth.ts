import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../../lib/initFirebase";
const admin = require("firebase-admin");
const firebase = require("firebase/app");
import fetch from "isomorphic-fetch";
import { getUser, handleLogoutCookies } from "../../lib/userUtils";
import sentryHandler from "../../lib/sentryHandler";

initFirebaseAdmin();

export default sentryHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let cookies = req.cookies;
    let userToken = cookies.userToken;

    // If user is logged out
    if (userToken === undefined) {
      res.statusCode = 200;
      res.send({ authenticated: false });
      return;
    }

    let { uid, userRecord } = await getUser(req, res);

    if (userRecord === undefined) {
      handleLogoutCookies(res);
      res.statusCode = 200;
      res.send({ authenticated: false });
      return;
    }

    res.statusCode = 200;
    res.send({ authenticated: true });
    return;
  }
);
