import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../lib/userUtils";
var crypto = require("crypto");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // get draft ID
  // get User email
  let { userRecord, uid } = await getUser(req, res);

  res.clearPreviewData();
  res.end("Preview mode disabled");
};
