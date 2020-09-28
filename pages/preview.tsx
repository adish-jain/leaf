import React from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from "next/head";
import { getDraftDataHandler, getUserStepsForDraft } from "../lib/postUtils";
import { getUsernameFromUid } from "../lib/userUtils";
import FinishedPost from "../components/FinishedPost";
import DefaultErrorPage from "next/error";
import { Step, File } from "../typescript/types/app_types";

export const getStaticProps: GetStaticProps = async (context) => {
  if (context.preview) {
    let draftId = context.previewData.draftId;
    let uid = context.previewData.uid;
    let username = await getUsernameFromUid(uid);
    let draftData = await getDraftDataHandler(uid, draftId);
    let title = draftData.title;
    let steps = await getUserStepsForDraft(uid, draftId);
    let files = draftData.files;

    // replace undefineds with null to prevent nextJS errors
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].lines === undefined || steps[i].lines === null) {
        steps[i].lines = null;
        steps[i].fileId = null;
        // to be deprecated
      }
      steps[i].fileName = null;
    }

    return {
      revalidate: 1,
      props: {
        title,
        steps,
        files,
        errored: false,
        username: username,
      },
    };
  } else {
    return {
      props: {
        title: "",
        steps: [],
        files: [],
        errored: true,
        username: "",
      },
    };
  }
};

type DraftPreviewProps = {
  steps: Step[];
  title: string;
  files: File[];
  errored: boolean;
  username: string;
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
        {props.errored ? (
          <DefaultErrorPage statusCode={404} />
        ) : (
          <FinishedPost
            steps={props.steps}
            title={props.title}
            files={props.files}
            username={props.username}
          />
        )}
      </main>
    </div>
  );
};

export default DraftPreview;
