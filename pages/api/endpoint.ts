import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import { initFirebase } from "../../lib/initFirebase";

// authentication
import handleLogin from "../../lib/api/login";
import handleSignup from "../../lib/api/signup";
import handleGoogleAuthentication from "../../lib/api/googleAuthentication";
import handleLogout from "../../lib/api/logout";

// get drafts for landing page
import handleAddDraft from "../../lib/api/createDraft";
import handleGetDrafts from "../../lib/api/getDrafts";
import handleDeleteDraft from "../../lib/api/deleteDraft";

// handle username & PW
import handleSetId from "../../lib/api/setId";
import handlecheckId from "../../lib/api/checkId";
import handleSetPassword from "../../lib/api/setPassword";
import handleSetEmailAndPassword from "../../lib/api/setEmailAndPassword";

// handle profile data
import handleSetProfile from "../../lib/api/setProfile";
import handleSaveProfileImage from "../../lib/api/saveProfileImage";
import handleDeleteProfileImage from "../../lib/api/deleteProfileImage";

// handle following
import handleFollowUser from "../../lib/api/followUser";
import handleUnfollowUser from "../../lib/api/unfollowUser";
import handleGetFeed from "../../lib/api/getFeed";

// user info
import handleGetUserInfo from "../../lib/api/getUserInfo";

// emails
import handleSetEmail from "../../lib/api/setEmail";
import handleSendEmailVerification from "../../lib/api/sendEmailVerification";

// handle publishing
import handlePublishPost from "../../lib/api/publishPost";
import handleGetPosts from "../../lib/api/getPosts";
import handleDeletePost from "../../lib/api/deletePost";

// editing drafts title
import handleSaveTitle from "../../lib/api/saveTitle";
import handleGetTitle from "../../lib/api/getTitle";

// editing draft content
import handleGetDraftContent from "../../lib/api/getDraftContent";
import handleSaveDraftContent from "../../lib/api/saveDraftContent";
import handleAddDraftContent from "../../lib/api/addDraftContent";
import handleDeleteDraftContent from "../../lib/api/deleteDraftContent";

// editing drafts steps
import handleGetAllDraftData from "../../lib/api/getAllDraftData";
import handleGetDraftMetadata from "../../lib/api/getDraftMetadata";

// editing drafts files
import handleDeleteFile from "../../lib/api/deleteFile";
import handleGetFiles from "../../lib/api/getFiles";
import handleUpdateFile from "../../lib/api/updateFile";

// images
import handleSaveImage from "../../lib/api/saveImage";
import handleDeleteImage from "../../lib/api/deleteImage";
import handleGetImages from "../../lib/api/getDraftImages";

// tags
import handleUpdateTags from "../../lib/api/updateTags";
import handleGetAllPostsData from "../../lib/api/getAllPostsData";
import handleGetPostTags from "../../lib/api/getPostTags";

// email
import handlePasswordReset from "../../lib/api/passwordReset";

// slate
import handleUpdateDraftText from "../../lib/api/updateDraftText";

// admin page
import handleTransferPost from "../../lib/api/transferPost";
import handleAuthenticateAdmin from "../../lib/api/authenticateAdmin";
import handleBackFillUid from "../../lib/api/backFillUid";

import sentryHandler from "../../lib/sentryHandler";

const firebase = require("firebase/app");
initFirebase();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default sentryHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
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

      case "googleAuthentication": {
        return handleGoogleAuthentication(req, res);
      }

      case "logout": {
        return handleLogout(req, res);
      }

      /*
    ------ Settings------
    */

      case "check_userId": {
        return handlecheckId(req, res);
      }

      case "set_userId": {
        return handleSetId(req, res);
      }

      case "set_userEmail": {
        return handleSetEmail(req, res);
      }

      case "set_userPassword": {
        return handleSetPassword(req, res);
      }

      case "set_email_and_password": {
        return handleSetEmailAndPassword(req, res);
      }

      case "get_userInfo": {
        return handleGetUserInfo(req, res);
      }

      case "sendEmailVerification": {
        return handleSendEmailVerification(req, res);
      }

      /* PROFILE */

      case "set_userProfile": {
        return handleSetProfile(req, res);
      }

      case "saveProfileImage": {
        return handleSaveProfileImage(req, res);
      }

      case "deleteProfileImage": {
        return handleDeleteProfileImage(req, res);
      }

      /* FOLLOW */

      case "followUser": {
        return handleFollowUser(req, res);
      }

      case "unfollowUser": {
        return handleUnfollowUser(req, res);
      }

      case "getFeed": {
        return handleGetFeed(req, res);
      }

      /* 
    ------ Manage Draft Content ------
    */
      case "handleGetDraftContent": {
        return handleGetDraftContent(req, res);
      }

      case "handleSaveDraftContent": {
        return handleSaveDraftContent(req, res);
      }

      case "addDraftContent": {
        return handleAddDraftContent(req, res);
      }

      case "deleteDraftContent": {
        return handleDeleteDraftContent(req, res);
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

      case "getAllDraftData": {
        return handleGetAllDraftData(req, res);
      }

      case "getDraftMetadata": {
        return handleGetDraftMetadata(req, res);
      }

      case "getDraftContent": {
        return handleGetDraftContent(req, res);
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

      case "delete_file": {
        return handleDeleteFile(req, res);
      }

      case "updateFile": {
        return handleUpdateFile(req, res);
      }

      // email
      case "passwordReset": {
        return handlePasswordReset(req, res);
      }

      // images
      case "saveImage": {
        return handleSaveImage(req, res);
      }

      case "deleteImage": {
        return handleDeleteImage(req, res);
      }

      case "getImages": {
        return handleGetImages(req, res);
      }

      // tags
      case "updateTags": {
        return handleUpdateTags(req, res);
      }

      case "getPostTags": {
        return handleGetPostTags(req, res);
      }

      case "getAllPostsData": {
        return handleGetAllPostsData(req, res);
      }

      // admin page
      case "authenticateAdmin": {
        return handleAuthenticateAdmin(req, res);
      }

      case "transferPost": {
        return handleTransferPost(req, res);
      }

      case "backFillUid": {
        return handleBackFillUid(req, res);
      }

      default:
        res.statusCode = 403;
        res.end();
    }
  }
);
