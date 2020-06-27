import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../components/Scrolling";
import PublishedCodeEditor from "../components/PublishedCodeEditor";

import { getUserStepsForDraft } from "../lib/userUtils";
const appStyles = require("../styles/App.module.scss");

export const getStaticProps: GetStaticProps = async (context) => {
  if (context.preview) {
    let draftId = context.previewData.draftId;
    let uid = context.previewData.uid;
    let steps = await getUserStepsForDraft(uid, draftId);

    return {
      props: {
        steps,
      },
    };
  } else {
    return {
      props: {
        steps: [],
      },
    };
  }
};

type StepType = {
  text: string;
  id: string;
};

type DraftPreviewProps = {
  steps: StepType[];
};

const DraftPreview = (props: DraftPreviewProps) => {
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
          <Scrolling changeStep={changeStep} steps={props.steps} />
          <PublishedCodeEditor currentStep={currentStep} />
        </div>
      </main>
    </div>
  );
};

export default DraftPreview;
