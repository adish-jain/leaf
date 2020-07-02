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

  let { data: storedSteps } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  // console.log(steps);

  // highlighting lines for steps 
  const [lines, changeLines] = useState({});
  const [saveLines, notSaveLines] = useState(false);
  // let stepLines;

  // DynamicCodeEditor -> CodeEditor -> [draftId]
  function highlightLines(start: any, end: any) {
    let startLine = start['line'];
    let endLine = end['line'];
    changeLines({'start': startLine, 'end': endLine});
    // console.log(lines);
  }

  function onHighlight() {
    // stepLines = lines;
    notSaveLines(true);
  }

  function unHighlight() {
    notSaveLines(false);
  }

  function saveStep(stepId: any, text: any) {
    var data = {
      requestedAPI: "save_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
      lines: saveLines ? lines : null,
    };

    let newStep = {"id":stepId, "lines": saveLines ? lines : null, "text": text};
    let optimisticSteps = [...storedSteps];
    optimisticSteps.push(newStep);
    mutate("/api/endpoint", optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedSteps = res.json();
      // mutate("/api/endpoint", updatedSteps);
      console.log(res);
    });

    notSaveLines(false);
  }

  function updateStoredStep(stepId: any, text: any, oldLines: any, removeLines: any) {
    let stepLines;
    if (removeLines) {
      stepLines = null;
    } else {
      stepLines = saveLines ? lines : oldLines;
    }
    let data = {
      requestedAPI: "update_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
      lines: stepLines,
    };

    let newStep = {"id": stepId, "lines": stepLines, "text": text};
    // @ts-ignore 
    let optimisticSteps = [];

    // @ts-ignore 
    storedSteps.forEach(element => {
      if (element["id"] != stepId) {
        optimisticSteps.push(element);
      } else {
        optimisticSteps.push(newStep);
      }
    });
    
    // @ts-ignore 
    mutate("/api/endpoint", optimisticSteps, false);
    
    fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    }).then(async (res: any) => {
        let updatedSteps = res.json();
        // mutate("/api/endpoint", updatedSteps);
        console.log(res);
    });

    notSaveLines(false);
  }

  function deleteStoredStep(stepId: any) {
    let data = {
      requestedAPI: "delete_step",
      draftId: draftId,
      stepId: stepId,
    };

    // @ts-ignore 
    let optimisticSteps = [];

    // @ts-ignore 
    storedSteps.forEach(element => {
      if (element["id"] != stepId) {
        optimisticSteps.push(element);
      } 
    });
    
    // @ts-ignore 
    mutate("/api/endpoint", optimisticSteps, false);

    fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    }).then(async (res: any) => {
        let updatedSteps = res.json();
        // mutate("/api/endpoint", updatedSteps);
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
          <Publishing 
            draftId={draftId} 
            storedSteps={storedSteps} 
            saveStep={saveStep} 
            updateStoredStep={updateStoredStep} 
            deleteStoredStep={deleteStoredStep}
            onHighlight={onHighlight} 
            unHighlight={unHighlight}/>
          <CodeEditor highlightLines={highlightLines} />
        </div>
      </main>
    </div>
  );
};

export default DraftView;
