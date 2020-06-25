import PublishedCodeEditor from "../components/PublishedCodeEditor";
import Scrolling from "../components/Scrolling";
import Head from "next/head";
import useSWR from "swr";
import React, { useState } from "react";

const appStyles = require("../styles/App.module.scss");

export default function Published() {
  const [currentStep, updateStep] = useState(0);

  function changeStep(newStep: number) {
    updateStep(newStep);
  }

  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Scrolling changeStep={changeStep} />
          <PublishedCodeEditor currentStep={currentStep}/>
        </div>
      </main>
    </div>
  );
}
