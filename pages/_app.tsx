import "../styles/global.scss";
// import "../styles/publishedstep.scss";
// import "../styles/prism-white.css";
import "../styles/prism-atom-dark.css";

import { AppProps } from "next/app";
import * as Sentry from "@sentry/node";
// import { useWindowSize } from "@react-hook/window-size";
import { useWindowSize } from "../lib/useWindowSize";
import { DimensionsContext } from "../contexts/dimensions-context";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === "production",
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

export const MOBILE_WIDTH = 450;

export default function App({ Component, pageProps }: AppProps) {
  const windowSize = useWindowSize();

  return (
    <DimensionsContext.Provider
      value={{
        height: windowSize.height || 0,
        width: windowSize.width || 0,
      }}
    >
      <Component {...pageProps} />
    </DimensionsContext.Provider>
  );
}
