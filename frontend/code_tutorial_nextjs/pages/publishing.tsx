import Head from "next/head";
import Publishing from "../components/Publishing";
import CodePreview from "../components/CodePreview";
import AddStep from "../components/AddStep";

const appStyles = require("../styles/App.module.scss");

export default function PublishingView() {
  console.log("hello world");
  return (
      <div className="container">
        <Head>
          <title>Publishing</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className={appStyles.App}>
          <AddStep />
          </div>
        </main>
      </div>
    );
  }
