import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";
import { serialize, parse } from "cookie";

import handleLogin from "../../lib/api/login";
import handleSignUp from "../../lib/api/signup";
import handleLogOut from "../../lib/api/logout";
import handleCreate from "../../lib/api/create";
import handleGetDrafts from "../../lib/api/getDrafts";

const firebase = require("firebase/app");
initFirebase();

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

export default (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let requestedAPI = requestBody.requestedAPI;
  switch (requestedAPI) {
    // authentication

    //POST
    case "login": {
      return handleLogin(req, res);
    }

    //POST
    case "signup": {
      return handleSignUp(req, res);
    }

    //POST
    case "logout": {
      return handleLogOut(req, res);
    }

    /* 
    ------ Publishing ------
    */

    case "get_drafts": {

      /* ----- POST -----
      Get all drafts
      */
      return handleGetDrafts(req, res);
    }

    default: {
      res.statusCode = 403;
      res.end();
    }
  }
};
