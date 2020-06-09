import "../styles/global.scss";
import { AppProps } from "next/app";

import "react-placeholder/lib/reactPlaceholder.css";


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
