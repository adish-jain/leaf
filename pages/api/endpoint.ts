import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase } from "../../lib/initFirebase";
import { setTokenCookies } from "../../lib/cookieUtils";
import { serialize, parse } from "cookie";

import loginHandler from "../../lib/api/login";
import signUpHandler from "../../lib/api/signup";
import logOutHandler from "../../lib/api/logout";
import addDraftHandler from "../../lib/api/createDraft";
import getDraftsHandler from "../../lib/api/getDrafts";
import handleDeleteDraft from "../../lib/api/deleteDraft";
import handleSaveStep from "../../lib/api/saveStep";
import handleDeleteStep from "../../lib/api/deleteStep";

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
    /* 
    ------ Authentication ------
    */

    //POST
    case "login": {
      return loginHandler(req, res);
    }

    //POST
    case "signup": {
      return signUpHandler(req, res);
    }

    //POST
    case "logout": {
      return logOutHandler(req, res);
    }

    /* 
    ------ Publishing ------
    */

    case "get_drafts": {
      /* ----- POST -----
      Get all drafts
      */
      return getDraftsHandler(req, res);
    }

    case "add_draft": {
      return addDraftHandler(req, res);
    }

    case "delete_draft": {
      /* ----- POST -----
      Delete Draft
      */
      return handleDeleteDraft(req, res);
    }

    // POST
    case "save_step": {
      console.log("in endpoint");
      return handleSaveStep(req, res);
    }

    case "delete_step": {
      return handleDeleteStep(req, res);
    }

    default: {
      res.statusCode = 403;
      res.end();
    }
  }
};
