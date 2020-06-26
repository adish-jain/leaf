import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
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

const DraftView = (props: any) => {
  const router = useRouter();

  // Draft ID
  const { preview_id } = router.query;

  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Publishing draftId={preview_id} storedSteps={props.steps} />
          <CodeEditor />
        </div>
      </main>
    </div>
  );
};

export default DraftView;
