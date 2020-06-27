import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../lib/userUtils";
var crypto = require("crypto");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cookies = req.cookies;
  //   console.log(cookies);
  let userToken = cookies.userToken;
  // get draft ID
  // get User email
  let { userRecord, uid } = await getUser(req, res);
  let { draftId } = req.query;

  //   let token = createToken();
  res.setPreviewData({
    uid,
    draftId: draftId,
  });
  res.writeHead(307, { Location: "/preview" });
  res.end("Preview mode enabled");
};

function createToken(): String {
  var token = crypto.randomBytes(64).toString("hex").substr(0, 10);
  return token;
}

// function createToken() {
//   return Math.random().toString(36).substr(2); // remove `0.`
// }
