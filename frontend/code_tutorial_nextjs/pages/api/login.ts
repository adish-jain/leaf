import { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import {initFirebase} from "../../lib/initFirebase";

const firebase = require("firebase/app");
initFirebase();

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.end("test");
};
