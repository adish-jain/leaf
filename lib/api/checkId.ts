import { NextApiRequest, NextApiResponse } from "next";
import { checkUsernameDNE } from "../userUtils";

export default async function setIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let username = req.body.username;

  if (!checkUsernameDNE(username)) {
    res.statusCode == 200;
    res.send({
      usernameTaken: false,
    });
    return;
  } else {
    res.statusCode == 200;
    res.send({
      usernameTaken: true,
    });
    return;
  }
}
