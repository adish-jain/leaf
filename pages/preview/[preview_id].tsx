import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
import { getUserFromToken } from "../../lib/userUtils";
const appStyles = require("../../styles/App.module.scss");

export async function getStaticPaths() {
  return {
    paths: [
      { params: { preview_id: "testing" } },
      { params: { preview_id: "testing124" } },
    ],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  let draft_id = context.previewData.draft_id;

  const rawData = {
    requestedAPI: "get_steps",
    draftid: draft_id,
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  let url = "";

  let uid = fetch(url, myRequest).then((res: any) => res.json());

  //   // get user token

  //   // using draft_id and email, get draft data

  return {
    props: {}, // will be passed to the page component as props
  };
};

const DraftView = () => {
  const router = useRouter();

  // Draft ID
  const { preview_id } = router.query;

  const steps: any[] = [];

  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Publishing draftid={preview_id} storedSteps={steps} />
          <CodeEditor />
        </div>
      </main>
    </div>
  );
};

export default DraftView;
