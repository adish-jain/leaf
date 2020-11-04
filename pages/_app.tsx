import "../styles/global.scss";
import "../styles/publishedstep.scss";

import { AppProps } from "next/app";

// import "draft-js/dist/Draft.css";

import * as Sentry from '@sentry/node'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
