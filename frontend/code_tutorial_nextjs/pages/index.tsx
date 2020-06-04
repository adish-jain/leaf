import Head from "next/head";
import CodePreview from "../components/CodePreview";
import Publishing from "../components/Publishing";
import fetch from "isomorphic-unfetch";

import InferGetStaticPropsType from "next";

const appStyles = require("../styles/App.module.scss");

export default function Pages() {
  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Publishing />
          <CodePreview />
        </div>
      </main>
    </div>
  );
}
