import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";
import PublishedCodeEditor from "../../components/PublishedCodeEditor";

import { getUserFromToken, getUserStepsForDraft } from "../../lib/userUtils";
const appStyles = require("../../styles/App.module.scss");

export async function getStaticPaths() {
  return {
    paths: [
      // { params: { previewId: "testing" } },
      // { params: { previewId: "testing124" } },
    ],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context);
  let draftId = context.previewData.draftId;
  let uid = context.previewData.uid;

  console.log("usertoken is", uid);
  console.log("draft id is", draftId);

  let steps = await getUserStepsForDraft(uid, draftId);
  console.log(steps);

  return {
    props: {
      steps,
    },
  };
};

type StepType = {
  text: String;
  id: String;
};

type DraftPreviewProps = {
  steps: StepType[];
};

const DraftPreview = (props: DraftPreviewProps) => {
  const router = useRouter();
  const [currentStep, updateStep] = useState(0);

  console.log(props);

  // Draft ID
  const { preview_id } = router.query;

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
