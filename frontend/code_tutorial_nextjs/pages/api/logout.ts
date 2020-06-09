import { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookies } from "../../lib/cookieUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let tokens = ["refreshToken", "userToken"];
  removeTokenCookies(res, tokens);
  res.status(200).end();
};
