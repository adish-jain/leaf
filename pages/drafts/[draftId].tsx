import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import { useBackend } from "../../lib/useBackend";
import { useTags } from "../../lib/useTags";
import { useDraftTitle } from "../../lib/useDraftTitle";
import useSWR from "swr";
import { DraftContext } from "../../contexts/draft-context";
import Tags from "../../components/Tags";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { DraftContent } from "../../components/DraftContent";
const fetch = require("node-fetch");
import { draftMetaData } from "../../typescript/types/frontend/postTypes";
global.Headers = fetch.Headers;
import appStyles from "../../styles/app.module.scss";
import "../../styles/draftheader.module.scss";
import { ToolbarContext } from "../../contexts/toolbar-context";
import { useToolbar } from "../../lib/useToolbar";
import {
  boldSelection,
  italicizeSelection,
  codeSelection,
} from "../../lib/useToolbar";
import { FilesContextWrapper } from "../../components/FilesContextWrapper";
import { LinesContext } from "../../contexts/lines-context";
import { useLines } from "../../lib/useLines";
import { TagsContext } from "../../contexts/tags-context";
import { PreviewContext } from "../../components/preview-context";
const initialMetaData: draftMetaData = {
  title: "",
  errored: false,
  published: false,
  username: "",
  createdAt: {
    _nanoseconds: 0,
    _seconds: 0,
  },
  profileImage: undefined,
  postId: "",
};

const prepareFetcher = (draftId: string) => {
  const rawData = {
    requestedAPI: "getDraftMetadata",
    draftId: draftId,
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = () =>
    fetch("/api/endpoint", myRequest).then((res: any) => res.json());

  return fetcher;
};

const DraftView = () => {
  const { authenticated, error, loading } = useLoggedIn();
  const router = useRouter();
  const { draftId } = router.query;
  const {
    saveState,
    updateSaving,
    currentMarkType,
    updateMarkType,
  } = useToolbar();
  const {
    currentlySelectedLines,
    changeSelectedLines,
    stepCoordinates,
    updateStepCoordinate,
    selectionCoordinates,
    updateSelectionCoordinates,
  } = useLines();
  const {
    draftContent,
    updateSlateSectionToBackend,
    addBackendBlock,
    currentlyEditingBlock,
    changeEditingBlock,
    deleteBlock,
    nextBlockType,
    removeFileFromCodeSteps,
  } = useBackend(authenticated, draftId as string);
  const fetcher = prepareFetcher(draftId as string);
  let { data: draftData, mutate } = useSWR<draftMetaData>(
    authenticated ? "getDraftMetadata" : null,
    fetcher,
    {
      initialData: initialMetaData,
      revalidateOnMount: true,
    }
  );
  const { onTitleChange, draftTitle } = useDraftTitle(
    draftId as string,
    authenticated
  );
  const errored = draftData?.errored || false;
  const published = draftData?.published || false;
  const username = draftData?.username || "";
  const profileImage = draftData?.profileImage || "";
  const postId = draftData?.postId || "";
  const createdAt = draftData?.createdAt || { _nanoseconds: 0, _seconds: 0 };
  const { toggleTag, tags, showTags, updateShowTags } = useTags(
    draftId as string,
    authenticated
  );
  const [showPreview, updateShowPreview] = useState(false);
  // wrapper function for deletilng a file.
  // when a file is deleted, make sure all associated steps remove that file
  if (errored) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div className={appStyles["container"]}>
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
      <PreviewContext.Provider
        value={{
          previewMode: showPreview,
          updatePreviewMode: updateShowPreview,
        }}
      >
        <LinesContext.Provider
          value={{
            currentlySelectedLines,
            changeSelectedLines,
            updateStepCoordinate,
            stepCoordinates,
            updateSelectionCoordinates,
            selectionCoordinates,
          }}
        >
          <ToolbarContext.Provider
            value={{
              setBold: boldSelection,
              setItalic: italicizeSelection,
              saveState: saveState,
              updateSaving: updateSaving,
              setCode: codeSelection,
              updateMarkType,
              currentMarkType,
            }}
          >
            <FilesContextWrapper
              authenticated={authenticated}
              draftId={draftId as string}
            >
              <TagsContext.Provider
                value={{
                  showTags,
                  updateShowTags,
                  selectedTags: tags,
                  toggleTag,
                }}
              >
                <main className={appStyles["AppWrapper"]}>
                  {showTags ? (
                    <Tags title={draftTitle} />
                  ) : (
                    <DraftContext.Provider
                      value={{
                        addBackendBlock: addBackendBlock,
                        updateSlateSectionToBackend: updateSlateSectionToBackend,
                        published: published,
                        username: username,
                        postId: postId,
                        draftId: draftId as string,
                        currentlyEditingBlock: currentlyEditingBlock,
                        changeEditingBlock: changeEditingBlock,
                        deleteBlock,
                        nextBlockType,
                        removeFileFromCodeSteps,
                        profileImage,
                        createdAt,
                      }}
                    >
                      <DraftContent
                        onTitleChange={onTitleChange}
                        draftTitle={draftTitle}
                        updateShowTags={updateShowTags}
                        draftContent={draftContent}
                      />
                    </DraftContext.Provider>
                  )}
                </main>
              </TagsContext.Provider>
            </FilesContextWrapper>
          </ToolbarContext.Provider>
        </LinesContext.Provider>
      </PreviewContext.Provider>
    </div>
  );
};

export default DraftView;
