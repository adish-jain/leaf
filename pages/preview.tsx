import React from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from "next/head";
import { getDraftDataHandler } from "../lib/postUtils";
import FinishedPost from "../components/FinishedPost";

export const getStaticProps: GetStaticProps = async (context) => {
  if (context.preview) {
    let draftId = context.previewData.draftId;
    let uid = context.previewData.uid;
    let draftData = await getDraftDataHandler(uid, draftId);
    let title = draftData.title;
    let steps = draftData.optimisticSteps;

    return {
      unstable_revalidate: 1,
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
        <FinishedPost steps={props.steps} title={props.title} />
      </main>
    </div>
  );
};

export default DraftPreview;
