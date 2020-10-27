import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getAllPostsHandler } from "../postUtils";

initFirebaseAdmin();
initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let results = await getAllPostsHandler();
  res.statusCode = 200;
  res.send(results);
};
