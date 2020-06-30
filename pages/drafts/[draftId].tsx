import { useRouter, Router } from "next/router";
import { useState, useCallback } from "react";
import { useLoggedIn, logOut } from "../../lib/UseLoggedIn";
import useSWR, { mutate } from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
import Head from "next/head";
const fetch = require("node-fetch");
import { GetStaticProps, GetStaticPaths } from "next";

global.Headers = fetch.Headers;

const appStyles = require("../../styles/App.module.scss");

const DraftView = () => {
  const { authenticated, error, loading } = useLoggedIn();
  const router = useRouter();

  // Draft ID
  const { draftId } = router.query;

  // if there are any steps in this draft, they will be fetched & repopulated
  const rawData = {
    requestedAPI: "get_steps",
    draftId: draftId,
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = (url: string) =>
    fetch(url, myRequest).then((res: any) => res.json());

  const initialData: any = [];

  let { data: steps } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  // highlighting lines for steps 
  const [lines, changeLines] = useState({});

  // DynamicCodeEditor -> CodeEditor -> [draftId]
  function highlightLines(start: any, end: any) {
    let startLine = start['line'];
    let endLine = end['line'];
    changeLines({'start': startLine, 'end': endLine});
    console.log(lines);
  }

  // Step -> Publishing -> [draftId]
  function associateLines(stepId: string) {
    console.log("associateLines");
    let data = {
      requestedAPI: "associate_lines",
      draftId: draftId,
      stepId: stepId,
      lines: lines,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedSteps = res.json();
      mutate("/api/endpoint", updatedSteps);
      console.log(res);
    });
  }

  // this page should look similar to how pages/article looks right now
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
          <Publishing draftId={draftId} storedSteps={steps} associateLines={associateLines}/>
          <CodeEditor highlightLines={highlightLines}/>
        </div>
      </main>
    </div>
  );
};

export default DraftView;
