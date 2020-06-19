import Publishing from "../components/Publishing";
import CodeEditor from '../components/CodeEditor'
import Head from "next/head";
import useSWR from "swr";

const appStyles = require("../styles/App.module.scss");

export default function ArticleView() {
  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Publishing />
          <CodeEditor />
        </div>
      </main>
    </div>
  );
}