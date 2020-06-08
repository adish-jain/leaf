import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import initFirebase from "../../lib/initFirebase";

initFirebase();

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.end("test");
};
