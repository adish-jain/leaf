import { NextApiRequest, NextApiResponse } from "next";
import useSWR from 'swr';

import db from '../../lib/firebase';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.end("test");
};







