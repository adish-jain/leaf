import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../lib/userUtils";
var crypto = require("crypto");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let userToken = req.cookies.usertoken;
  // get draft ID
  // get User email
  let { userRecord } = await getUser(req, res);
  let { draft_id } = req.query;
  res.setPreviewData({
    userToken,
    draft_id: draft_id,
  });
  // create random string
  let token = createToken();
  // redirect to /preview/randomstring
  console.log("token is", token);
  res.writeHead(307, { Location: "/preview/" + token });
  res.end("Preview mode enabled");
};

function createToken(): String {
  var token = crypto.randomBytes(64).toString("hex").substr(0, 10);
  return token;
}

// function createToken() {
//   return Math.random().toString(36).substr(2); // remove `0.`
// }
