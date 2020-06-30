import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase } from "../../lib/initFirebase";

import handleLogin from "../../lib/api/login";
import handleSignup from "../../lib/api/signup";
import handleLogout from "../../lib/api/logout";
import handleAddDraft from "../../lib/api/createDraft";
import handleGetDrafts from "../../lib/api/getDrafts";
import handleDeleteDraft from "../../lib/api/deleteDraft";
import handleGetSteps from "../../lib/api/getSteps"
import handleSaveStep from "../../lib/api/saveStep";
import handleDeleteStep from "../../lib/api/deleteStep";
import handleUpdateStep from "../../lib/api/updateStep";
import handleAssociateLines from "../../lib/api/associateLines";

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
      return handleLogin(req, res);
    }

    //POST
    case "signup": {
      return handleSignup(req, res);
    }

    //POST
    case "logout": {
      return handleLogout(req, res);
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

    case "add_draft": {
      return handleAddDraft(req, res);
    }

    case "delete_draft": {
      /* ----- POST -----
      Delete Draft
      */
      return handleDeleteDraft(req, res);
    }

    // POST
    case "get_steps": {
      return handleGetSteps(req, res);
    }

    // POST
    case "save_step": {
      return handleSaveStep(req, res);
    }

    // POST
    case "delete_step": {
      return handleDeleteStep(req, res);
    }

    // POST
    case "update_step": {
      return handleUpdateStep(req, res);
    }

    case "associate_lines": {
      return handleAssociateLines(req, res);
    }

    default: {
      res.statusCode = 403;
      res.end();
    }
  }
};
