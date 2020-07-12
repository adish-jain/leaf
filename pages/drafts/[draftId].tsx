import { useRouter, Router } from "next/router";
import { useState, useCallback } from "react";
import { useLoggedIn, logOut } from "../../lib/UseLoggedIn";
import useSWR from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
import Head from "next/head";
const fetch = require("node-fetch");
import { GetStaticProps, GetStaticPaths } from "next";

global.Headers = fetch.Headers;

const appStyles = require("../../styles/App.module.scss");

type File = {
  //replace with enum
  language: string;
  code: string;
  name: string;
};

let numOfUntitleds = 1;

const DraftView = () => {
  const { authenticated, error, loading } = useLoggedIn();
  // manage code files
  const [selectedFileIndex, changeSelectedFileIndex] = useState(0);
  //
  const [files, updateFiles] = useState<File[]>([
    {
      name: "untitled.txt",
      code: "",
      language: "jsx",
    },
  ]);

  // highlighting lines for steps
  const [lines, changeLines] = useState({});
  const [saveLines, notSaveLines] = useState(false);

  const router = useRouter();
  // Draft ID
  const { draftId } = router.query;

  // if there are any steps in this draft, they will be fetched & repopulated
  const rawData = {
    requestedAPI: "get_draft_data",
    draftId: draftId,
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = (url: string) =>
    fetch(url, myRequest).then((res: any) => res.json());

  const initialData: any = { title: "", optimisticSteps: [], code: "" };

  let { data: draftData, mutate } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  let draftTitle = draftData["title"];
  let storedSteps = draftData["optimisticSteps"];
  let draftCode = draftData["code"];

  // DynamicCodeEditor -> CodeEditor -> [draftId]
  function highlightLines(start: any, end: any) {
    let startLine = start["line"];
    let endLine = end["line"];
    changeLines({ start: startLine, end: endLine });
  }

  function onHighlight() {
    notSaveLines(true);
  }

  function unHighlight() {
    notSaveLines(false);
  }

  // Files functions

  function changeCode(value: string) {
    let duplicateFiles = [...files];
    duplicateFiles[selectedFileIndex].code = value;
    updateFiles(duplicateFiles);
  }

  function addFile() {
    // make sure file is untitled2, untitled3, etc.
    numOfUntitleds++;
    let newFileName = `untitled${numOfUntitleds}.txt`;

    updateFiles(
      files.concat({
        name: newFileName,
        code: "",
        language: "jsx",
      })
    );
  }

  function deleteFile(toDeleteIndex: number) {
    // can have minimum one file
    if (files.length === 1) {
      return;
    }
    if (toDeleteIndex < 0 || toDeleteIndex > files.length - 1) {
      return;
    }

    let cloneFiles = [...files];
    if (toDeleteIndex <= selectedFileIndex) {
      // shift selected file index back by one, with minimum index of 0
      let newIndex = Math.max(selectedFileIndex - 1, 0);
      changeSelectedFileIndex(newIndex);
    }
    cloneFiles.splice(toDeleteIndex, 1);
    updateFiles(cloneFiles);
  }

  /*
  Helper function to find the step with the associated stepId in `storedSteps`
  */
  function findIdx(stepId: any) {
    let idx = 0;
    let counter = 0;

    storedSteps.forEach((element: { id: any; lines: any; text: any }) => {
      if (element["id"] == stepId) {
        idx = counter;
      }
      counter += 1;
    });
    return idx;
  }

  /*
  Saves a step into Firebase. Triggered from `Step.tsx`.
  */
  function saveStep(stepId: any, text: any) {
    var data = {
      requestedAPI: "save_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
      lines: saveLines ? lines : null,
      order: storedSteps.length,
    };

    let newStep = { id: stepId, lines: saveLines ? lines : null, text: text };
    let title = draftTitle;
    let code = draftCode;
    let optimisticSteps = [...storedSteps];
    optimisticSteps.push(newStep);
    let mutateState = { title, optimisticSteps, code };
    mutate(mutateState, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });

    notSaveLines(false);
  }

  /*
  Updates a step in Firebase. Triggered from `EditingStoredStep.tsx`.
  */
  function updateStoredStep(
    stepId: any,
    text: any,
    oldLines: any,
    removeLines: any
  ) {
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

    let newStep = { id: stepId, lines: stepLines, text: text };
    let title = draftTitle;
    let code = draftCode;
    let optimisticSteps = storedSteps.slice();
    let idx = findIdx(stepId);
    optimisticSteps[idx] = newStep;
    let mutateState = { title, optimisticSteps, code };
    mutate(mutateState, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });

    notSaveLines(false);
  }

  /*
  Deletes a step from Firebase. Triggered from `StoredStep.tsx`.
  */
  function deleteStoredStep(stepId: any) {
    let optimisticSteps = storedSteps.slice();
    let idx = findIdx(stepId);
    let stepsToChange = optimisticSteps.slice(idx + 1, optimisticSteps.length);
    optimisticSteps.splice(idx, 1);
    let title = draftTitle;
    let code = draftCode;
    let mutateState = { title, optimisticSteps, code };
    mutate(mutateState, false);

    let data = {
      requestedAPI: "delete_step",
      draftId: draftId,
      stepId: stepId,
      stepsToChange: stepsToChange,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  /*
  Moves a step up by changing its order in Firebase & in `optimisticSteps`. 
  Triggered from `RenderedStoredStep.tsx`.
  */
  function moveStepUp(stepId: any) {
    let idx = findIdx(stepId);
    if (idx == 0) {
      return;
    }

    let optimisticSteps = storedSteps.slice();

    let data = {
      requestedAPI: "change_step_order",
      draftId: draftId,
      stepId: stepId,
      neighborId: optimisticSteps[idx - 1]["id"],
      oldIdx: idx,
      newIdx: idx - 1,
    };

    [optimisticSteps[idx], optimisticSteps[idx - 1]] = [
      optimisticSteps[idx - 1],
      optimisticSteps[idx],
    ];
    let title = draftTitle;
    let code = draftCode;
    let mutateState = { title, optimisticSteps, code };
    mutate(mutateState, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  /*
  Moves a step down by changing its order in Firebase & in `optimisticSteps`. 
  Triggered from `RenderedStoredStep.tsx`.
  */
  function moveStepDown(stepId: any) {
    let idx = findIdx(stepId);
    if (idx == storedSteps.length - 1) {
      return;
    }
    let optimisticSteps = storedSteps.slice();

    let data = {
      requestedAPI: "change_step_order",
      draftId: draftId,
      stepId: stepId,
      neighborId: optimisticSteps[idx + 1]["id"],
      oldIdx: idx,
      newIdx: idx + 1,
    };

    [optimisticSteps[idx], optimisticSteps[idx + 1]] = [
      optimisticSteps[idx + 1],
      optimisticSteps[idx],
    ];
    let title = draftTitle;
    let code = draftCode;
    let mutateState = { title, optimisticSteps, code };
    mutate(mutateState, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  /*
  Saves the title of the draft in Firestore. 
  Triggered from `Publishing.tsx`.
  */
  function saveTitle(title: string) {
    var data = {
      requestedAPI: "save_title",
      draftId: draftId,
      title: title,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  function saveCode(code: string) {
    var data = {
      requestedAPI: "save_code",
      draftId: draftId,
      code: code,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      // console.log(res);
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
            title={draftTitle}
            storedSteps={storedSteps}
            saveStep={saveStep}
            updateStoredStep={updateStoredStep}
            deleteStoredStep={deleteStoredStep}
            onHighlight={onHighlight}
            unHighlight={unHighlight}
            moveStepUp={moveStepUp}
            moveStepDown={moveStepDown}
            saveTitle={saveTitle}
          />
          <CodeEditor
            highlightLines={highlightLines}
            saveCode={saveCode}
            draftCode={files[selectedFileIndex].code}
            files={files}
            addFile={addFile}
            deleteFile={deleteFile}
            selectedFileIndex={selectedFileIndex}
            changeCode={changeCode}
            changeSelectedFile={changeSelectedFileIndex}
          />
        </div>
      </main>
    </div>
  );
};

export default DraftView;
