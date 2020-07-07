import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../components/Scrolling";
import PublishedCodeEditor from "../components/PublishedCodeEditor";

import { getDraftDataHandler } from "../lib/postUtils";
const appStyles = require("../styles/App.module.scss");

export const getStaticProps: GetStaticProps = async (context) => {
  if (context.preview) {
    let draftId = context.previewData.draftId;
    let uid = context.previewData.uid;
    let draftData = await getDraftDataHandler(uid, draftId);
    let title = draftData.title;
    let steps = draftData.optimisticSteps;

    return {
      props: {
        title,
        steps,
      },
    };
  } else {
    return {
      props: {
        title: "Untitled",
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
  title: string;
};

const stepsInView: { [stepIndex: number]: boolean } = {};

const DraftPreview = (props: DraftPreviewProps) => {
  const [currentStep, updateStep] = useState(0);

  function changeStep(newStep: number, yPos: number, entered: boolean) {
    // stepsInView keeps track of what steps are inside the viewport
    stepsInView[newStep] = entered;

    /* whichever step is the closest to the top of the viewport 
    AND is inside the viewport becomes the selected step */
    for (let step in stepsInView) {
      if (stepsInView[step]) {
        updateStep(Number(step));
        break;
      }
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie) {
            if (!document.cookie.includes('authed')) {
              window.location.href = "/"
            }
          }
          else {
            window.location.href = '/'
          }
        `,
          }}
        />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Scrolling
            title={props.title}
            currentStep={currentStep}
            changeStep={changeStep}
            steps={props.steps}
          />
          <PublishedCodeEditor currentStep={currentStep} />
        </div>
      </main>
    </div>
  );
};

export default DraftPreview;
