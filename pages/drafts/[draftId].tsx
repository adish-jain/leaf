import { useRouter, Router } from "next/router";
import { useState, useCallback } from "react";
import { useLoggedIn, logOut } from "../../lib/UseLoggedIn";
import { useFiles } from "../../lib/useFiles";
import { useSteps } from "../../lib/useSteps";
import { useDraftTitle } from "../../lib/useDraftTitle";
import useSWR from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
import Preview from "../../components/Preview";
import Header from "../../components/Header";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { goToPost } from "../../lib/usePosts";
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
    fetch("/api/endpoint", myRequest).then((res: any) => res.json());

  const initialData: any = {
    files: [
      {
        id: "",
        name: "",
        code: "",
        language: "",
      },
    ],
    errored: false,
    published: false,
    postId: "",
    username: "",
  };

  let { data: draftData, mutate } = useSWR(
    authenticated ? "getDraftData" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  let draftFiles = draftData["files"];
  let errored = draftData["errored"];
  const draftPublished = draftData["published"];
  const postId = draftData["postId"];
  const username = draftData["username"];

  let { onTitleChange, draftTitle } = useDraftTitle(
    draftId as string,
    authenticated
  );


  let {
    saveStep,
    mutateStoredStep,
    saveStepToBackend,
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
    addStepImage,
    deleteStepImage
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
    onNameChange,
    saveFileCode,
  } = useFiles(draftId, draftFiles, mutate);

  async function goToPublishedPost() {
    window.location.href = `/${username}/${postId}`;
  }

  // wrapper function for deleting a file.
  // when a file is deleted, make sure all associated steps remove that file
  function deleteStepAndFile(toDeleteIndex: number) {
    let fileId: string = draftFiles[toDeleteIndex].id;
    for (let i = 0; i < realSteps!.length; i++) {
      if (realSteps![i].fileId === fileId) {
        removeLines(i);
      }
    }
    removeFile(toDeleteIndex);
  }

  return (
    <div className="container">
      <Head>
        <title>{draftTitle}</title>
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
        <Header
          username={username}
          logout={false}
          settings={true}
          profile={true}
        />
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
              mutateStoredStep={mutateStoredStep}
              saveStepToBackend={saveStepToBackend}
              deleteStoredStep={deleteStoredStep}
              moveStepUp={moveStepUp}
              moveStepDown={moveStepDown}
              onTitleChange={onTitleChange}
              editingStep={editingStep}
              changeEditingStep={changeEditingStep}
              selectedFileIndex={selectedFileIndex}
              lines={lines}
              files={draftFiles}
              saveLines={saveLines}
              published={draftPublished}
              goToPublishedPost={goToPublishedPost}
            />
            <div className={appStyles.RightPane}>
              {editingStep !== -1 ? 
                (<Preview 
                  draftId={draftId as string}
                  steps={realSteps}
                  editingStep={editingStep}
                  addStepImage={addStepImage}
                  deleteStepImage={deleteStepImage}
                />) :
                (<div></div>)
              } 
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
                onNameChange={onNameChange}
                language={draftFiles[selectedFileIndex].language}
                changeLines={changeLines}
                saveLines={saveLines}
                lines={lines}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DraftView;
