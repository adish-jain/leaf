import "../styles/global.scss";
import { AppProps } from "next/app";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/oceanic-next.css";

import "draft-js/dist/Draft.css";

import "../styles/toolbarStyles.scss";

import "../styles/vscode-dark.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
