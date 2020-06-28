import { NextApiRequest, NextApiResponse } from "next";
import { handleLogoutCookies } from "../../lib/userUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  handleLogoutCookies(res);
  res.status(200).end();
};
