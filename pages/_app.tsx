import "../styles/global.scss";
// import "../styles/publishedstep.scss";
// import "../styles/prism-white.css";
import "../styles/prism-atom-dark.css";

import { AppProps } from "next/app";
import * as Sentry from "@sentry/node";
import { useWindowSize } from "@react-hook/window-size";
import { DimensionsContext } from "../contexts/dimensions-context";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === "production",
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

export const MOBILE_WIDTH = 450;

export default function App({ Component, pageProps }: AppProps) {
  const [width, height] = useWindowSize();

  return (
    <DimensionsContext.Provider
      value={{
        height: height,
        width: width,
      }}
    >
      <Component {...pageProps} />
    </DimensionsContext.Provider>
  );
}
