import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase } from "../../lib/initFirebase";

// authentication
import handleLogin from "../../lib/api/login";
import handleSignup from "../../lib/api/signup";
import handleLogout from "../../lib/api/logout";

// get drafts for landing page
import handleAddDraft from "../../lib/api/createDraft";
import handleGetDrafts from "../../lib/api/getDrafts";
import handleDeleteDraft from "../../lib/api/deleteDraft";

// handle username
import handleSetId from "../../lib/api/setId";
import handlecheckId from "../../lib/api/checkId";

// user info
import handleGetUserInfo from "../../lib/api/getUserInfo";

// handle publishing
import handlePublishPost from "../../lib/api/publishPost";
import handleGetPosts from "../../lib/api/getPosts";
import handleDeletePost from "../../lib/api/deletePost";

// editing drafts
import handleGetSteps from "../../lib/api/getDraftSteps";
import handleGetDraftData from "../../lib/api/getDraftData";
import handleSaveStep from "../../lib/api/saveStep";
import handleDeleteStep from "../../lib/api/deleteStep";
import handleUpdateStep from "../../lib/api/updateStep";
import handleUpdateStepLines from "../../lib/api/updateStepLines";
import handleChangeStepOrder from "../../lib/api/changeStepOrder";
import handleSaveTitle from "../../lib/api/saveTitle";
import handleGetTitle from '../../lib/api/getTitle';
import handleSaveFile from "../../lib/api/saveFile";
import handleDeleteFile from "../../lib/api/deleteFile";
import handleChangeFileLanguage from "../../lib/api/changeFileLanguage";
import handleGetFiles from '../../lib/api/getFiles';
import handleSaveFileCode from "../../lib/api/saveFileCode";
import handleSaveFileName from "../../lib/api/saveFileName";

const firebase = require("firebase/app");
initFirebase();

export default (req: NextApiRequest, res: NextApiResponse) => {
  let requestBody = req.body;
  let requestedAPI = requestBody.requestedAPI;
  switch (requestedAPI) {
    /* 
    ------ Authentication ------
    */

    case "login": {
      return handleLogin(req, res);
    }

    case "signup": {
      return handleSignup(req, res);
    }

    case "logout": {
      return handleLogout(req, res);
    }

    /*
    ------ Settings ------
    */

    case "check_userId": {
      return handlecheckId(req, res);
    }

    case "set_userId": {
      return handleSetId(req, res);
    }

    case "get_userInfo": {
      return handleGetUserInfo(req, res);
    }

    /* 
    ------ Drafts ------
    */

    case "getDrafts": {
      /* 
      Get all drafts
      */
      return handleGetDrafts(req, res);
    }

    case "add_draft": {
      return handleAddDraft(req, res);
    }

    case "delete_draft": {
      /* 
      Delete Draft
      */
      return handleDeleteDraft(req, res);
    }

    // POST
    case "get_draft_data": {
      return handleGetDraftData(req, res);
    }

    case "getDraftSteps": {
      return handleGetSteps(req, res);
    }

    case "save_step": {
      return handleSaveStep(req, res);
    }

    case "delete_step": {
      return handleDeleteStep(req, res);
    }

    case "update_step": {
      return handleUpdateStep(req, res);
    }

    case "updateStepLines": {
      return handleUpdateStepLines(req, res);
    }

    /* 
    ------ Posts ------
    */

    case "publishPost": {
      return handlePublishPost(req, res);
    }

    case "getPosts": {
      return handleGetPosts(req, res);
    }

    case "deletePost": {
      return handleDeletePost(req, res);
    }

    // POST
    case "change_step_order": {
      return handleChangeStepOrder(req, res);
    }

    // POST
    case "save_title": {
      return handleSaveTitle(req, res);
    }

    case "getDraftTitle": {
      return handleGetTitle(req, res);
    }

    /* 
    ------ Files ------
    */

    // POST
    case "getFiles": {
      return handleGetFiles(req, res);
    }

    case "save_file": {
      return handleSaveFile(req, res);
    }

    case "delete_file": {
      return handleDeleteFile(req, res);
    }

    case "change_file_language": {
      return handleChangeFileLanguage(req, res);
    }

    case "save_file_code": {
      return handleSaveFileCode(req, res);
    }

    case "save_file_name": {
      return handleSaveFileName(req, res);
    }

    default: {
      res.statusCode = 403;
      res.end();
    }
  }
};
