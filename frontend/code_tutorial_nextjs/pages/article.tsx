
import CodePreview from "../components/CodePreview";
import Publishing from "../components/Publishing";
import Head from "next/head";

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
            <CodePreview />
          </div>
        </main>
      </div>
    );
  }