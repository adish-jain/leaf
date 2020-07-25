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
    let files = draftData.files;

    for (let i = 0; i < steps.length; i++) {
      if (steps[i].lines === undefined || steps[i].lines === null) {
        steps[i].lines = null;
        console.log("setting ", i, " to null");
        steps[i].fileName = null;
      }
    }

    return {
      unstable_revalidate: 1,
      props: {
        title,
        steps,
        files,
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

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type DraftPreviewProps = {
  steps: StepType[];
  title: string;
  files: File[];
};

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
        <FinishedPost
          steps={props.steps}
          title={props.title}
          files={props.files}
        />
      </main>
    </div>
  );
};

export default DraftPreview;
