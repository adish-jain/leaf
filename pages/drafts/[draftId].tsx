import { useRouter, Router } from "next/router";
import { useState, useCallback } from "react";
import { useLoggedIn, logOut } from "../../lib/UseLoggedIn";
import { useFiles } from "../../lib/useFiles";
import { useSteps } from "../../lib/useSteps";
import { useDraftTitle } from "../../lib/useDraftTitle";
import useSWR from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
import DefaultErrorPage from "next/error";
import Head from "next/head";
const fetch = require("node-fetch");

global.Headers = fetch.Headers;

const appStyles = require("../../styles/App.module.scss");

type File = {
  id: string;
  language: string; //replace with enum
  code: string;
  name: string;
};

const DraftView = () => {
  const { authenticated, error, loading } = useLoggedIn();
  const router = useRouter();
  // Draft ID
  const { draftId } = router.query;
  // highlighting lines for steps

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

  const initialData: any = {
    title: "",
    optimisticSteps: [],
    files: [
      {
        id: "",
        name: "",
        code: "",
        language: "",
      },
    ],
    errored: false,
  };

  let { data: draftData, mutate } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  let draftFiles = draftData["files"];
  let errored = draftData["errored"];

  let { saveTitle, draftTitle } = useDraftTitle(
    draftId as string,
    authenticated
  );

  let {
    saveStep,
    updateStoredStep,
    deleteStoredStep,
    moveStepUp,
    moveStepDown,
    realSteps,
    editingStep,
    changeEditingStep,
    lines,
    changeLines,
    saveLines,
    removeLines,
  } = useSteps(draftId as string, authenticated);

  let {
    selectedFileIndex,
    codeFiles,
    addFile,
    removeFile,
    changeCode,
    changeSelectedFileIndex,
    changeFileLanguage,
    saveFileName,
    saveFileCode,
  } = useFiles(draftId, draftFiles, draftTitle, realSteps, mutate);


  // wrapper function for deleting a file.
  // when a file is deleted, make sure all associated steps remove that file
  function deleteStepAndFile(toDeleteIndex: number) {
    let fileName: string = draftFiles[toDeleteIndex].name;
    for (let i = 0; i < realSteps!.length; i++) {
      if (realSteps![i].fileName === fileName) {
        removeLines(i);
      }
    }
    removeFile(toDeleteIndex);
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
      <main className={appStyles.AppWrapper}>
        <style>{`
        div {
       }
      `}</style>
        {errored ? (
          <DefaultErrorPage statusCode={404} />
        ) : (
          <div className={appStyles.App}>
            <Publishing
              draftId={draftId}
              title={draftTitle}
              storedSteps={realSteps!}
              saveStep={saveStep}
              updateStoredStep={updateStoredStep}
              deleteStoredStep={deleteStoredStep}
              moveStepUp={moveStepUp}
              moveStepDown={moveStepDown}
              saveTitle={saveTitle}
              editingStep={editingStep}
              changeEditingStep={changeEditingStep}
              selectedFile={codeFiles[selectedFileIndex]}
              lines={lines}
              saveLines={saveLines}
            />
            <CodeEditor
              draftId={draftId as string}
              editingStep={editingStep}
              saveFileCode={saveFileCode}
              draftCode={codeFiles[selectedFileIndex].code}
              files={draftFiles}
              addFile={addFile}
              removeFile={deleteStepAndFile}
              selectedFileIndex={selectedFileIndex}
              changeCode={changeCode}
              changeSelectedFile={changeSelectedFileIndex}
              changeFileLanguage={changeFileLanguage}
              saveFileName={saveFileName}
              language={draftFiles[selectedFileIndex].language}
              changeLines={changeLines}
              saveLines={saveLines}
              lines={lines}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default DraftView;
