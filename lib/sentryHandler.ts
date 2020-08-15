import * as Sentry from "@sentry/node";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

Sentry.init({ dsn: process.env.SENTRY_DSN });

const sentryHandler = (apiHandler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await apiHandler(req, res);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
      await Sentry.flush(2000);
      throw error;
    }
  };
};

export default sentryHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // ...your main business logic here
  }
);
