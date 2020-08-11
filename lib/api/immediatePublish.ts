import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../lib/userUtils";
var crypto = require("crypto");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // get draft ID
  // get User email
  let { userRecord, uid } = await getUser(req, res);

  //   let token = createToken();
  res.setPreviewData({
    uid,
  });
  res.end("Preview mode enabled");
};
