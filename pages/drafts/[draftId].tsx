import { useRouter } from "next/router";
import {
  useState,
  useCallback,
  Component,
  Dispatch,
  SetStateAction,
} from "react";
import { useLoggedIn, logOut } from "../../lib/UseLoggedIn";
import { useFiles } from "../../lib/useFiles";
import { useSteps } from "../../lib/useSteps";
import { useTags } from "../../lib/useTags";
import { useDraftTitle } from "../../lib/useDraftTitle";
import useSWR from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from "../../components/CodeEditor";
import Tags from "../../components/Tags";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { goToPost } from "../../lib/usePosts";
const fetch = require("node-fetch");
import { File, Step, Lines } from "../../typescript/types/app_types";
global.Headers = fetch.Headers;
import Router from "next/router";
import Link from "next/link";
import "../../styles/app.scss";
import "../../styles/draftheader.scss";
import { DraftHeader } from "../../components/Headers";
import { DraftJsButtonProps } from "draft-js-buttons";
import { motion, AnimatePresence } from "framer-motion";
import SlateEditor from "../../components/SlateSection";
import MarkdownPreviewExample from "../../components/MarkdownSection";

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
    tags: [],
    username: "",
    createdAt: {
      _nanoseconds: 0,
      _seconds: 0,
    },
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
  const tags = draftData["tags"];
  const username = draftData["username"];
  const createdAt = draftData["createdAt"];

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
    deleteStepImage,
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

  let { toggleTag } = useTags(
    tags, 
    draftId as string, 
    draftFiles, 
    errored, 
    draftPublished, 
    postId, 
    username, 
    createdAt,
    mutate
  );

  // const [shouldShowBlock, updateShowBlock] = useState(false);
  const [showPreview, updateShowPreview] = useState(false);
  const [showTags, updateShowTags] = useState(false);

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

  if (errored) {
    return <DefaultErrorPage statusCode={404} />;
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
      <main className={"AppWrapper"}>
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <FinishedPost
                steps={realSteps!}
                title={draftTitle}
                tags={tags}
                username={username}
                files={draftFiles}
                updateShowPreview={updateShowPreview}
                previewMode={true}
                publishedAtSeconds={createdAt.publishedAtSeconds}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {showTags ? 
          (<Tags 
            showTags={showTags}
            updateShowTags={updateShowTags}
            title={draftTitle}
            selectedTags={tags}
            toggleTag={toggleTag}
          />) : 
          (<DraftContent
            showPreview={showPreview}
            showTags={showTags}
            username={username}
            postId={postId}
            codeFiles={codeFiles}
            selectedFileIndex={selectedFileIndex}
            draftFiles={draftFiles}
            realSteps={realSteps}
            editingStep={editingStep}
            lines={lines}
            tags={tags}
            changeEditingStep={changeEditingStep}
            mutateStoredStep={mutateStoredStep}
            changeLines={changeLines}
            saveStepToBackend={saveStepToBackend}
            deleteStoredStep={deleteStoredStep}
            moveStepDown={moveStepDown}
            onTitleChange={onTitleChange}
            deleteStepAndFile={deleteStepAndFile}
            draftPublished={draftPublished}
            draftTitle={draftTitle}
            saveFileCode={saveFileCode}
            onNameChange={onNameChange}
            saveFileName={saveFileName}
            changeFileLanguage={changeFileLanguage}
            changeSelectedFileIndex={changeSelectedFileIndex}
            changeCode={changeCode}
            removeFile={removeFile}
            addFile={addFile}
            draftId={draftId as string}
            saveStep={saveStep}
            moveStepUp={moveStepUp}
            saveLines={saveLines}
            removeLines={removeLines}
            addStepImage={addStepImage}
            deleteStepImage={deleteStepImage}
            updateShowPreview={updateShowPreview}
            updateShowTags={updateShowTags}
            mutate={mutate}
        />)}
      </main>
    </div>
  );
};

type DraftContentProps = {
  showPreview: boolean;
  showTags: boolean;
  username: string;
  postId: string;
  draftId: string;
  saveStep: (stepId: string, text: string) => void;
  mutateStoredStep: (stepId: any, text: any) => void;
  saveStepToBackend: (stepId: string, text: string) => Promise<void>;
  deleteStoredStep: (stepId: any) => void;
  moveStepUp: (stepId: any) => void;
  moveStepDown: (stepId: any) => void;
  realSteps: Step[] | undefined;
  editingStep: number;
  changeEditingStep: Dispatch<SetStateAction<number>>;
  lines: Lines;
  tags: any;
  changeLines: Dispatch<SetStateAction<Lines>>;
  saveLines: (fileId: string, remove: boolean) => void;
  removeLines: (stepIndex: number) => void;
  addStepImage: (selectedImage: any, stepId: string) => Promise<void>;
  deleteStepImage: (stepId: string) => Promise<void>;
  selectedFileIndex: number;
  codeFiles: File[];
  addFile: () => void;
  removeFile: (toDeleteIndex: number) => void;
  changeCode: (value: string) => void;
  changeSelectedFileIndex: Dispatch<SetStateAction<number>>;
  changeFileLanguage: (language: string, external: boolean) => void;
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  saveFileCode: () => void;
  draftTitle: string;
  draftPublished: boolean;
  deleteStepAndFile: (toDeleteIndex: number) => void;
  draftFiles: File[];
  onTitleChange: (updatedtitle: string) => Promise<void>;
  updateShowPreview: Dispatch<SetStateAction<boolean>>;
  updateShowTags: Dispatch<SetStateAction<boolean>>;
  mutate: any;
};

type DraftContentState = {
  showPreview: boolean;
};

class DraftContent extends Component<DraftContentProps, DraftContentState> {
  constructor(props: DraftContentProps) {
    super(props);

    this.state = {
      showPreview: false,
    };

    this.goToPublishedPost = this.goToPublishedPost.bind(this);
    this.publishDraft = this.publishDraft.bind(this);
    this.DraftComponent = this.DraftComponent.bind(this);
  }

  publishDraft() {
    let { draftId } = this.props;
    fetch("/api/endpoint", {
      method: "POST",
      redirect: "follow",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ requestedAPI: "publishPost", draftId: draftId }),
    })
      .then(async (res: any) => {
        let resJson = await res.json();
        let newUrl = resJson.newURL;
        if (newUrl === "unverified") {
          alert("Please verify your email before publishing.");
        } else {
          Router.push(newUrl);
        }
        // Router.push(newUrl);
      })
      .catch(function (err: any) {
        console.log(err);
      });
  }

  async goToPublishedPost() {
    let { username, postId } = this.props;
    window.location.href = `/${username}/${postId}`;
  }

  DraftComponent() {
    let {
      username,
      draftPublished,
      draftId,
      draftTitle,
      realSteps,
      saveStep,
      mutateStoredStep,
      saveStepToBackend,
      deleteStoredStep,
      moveStepUp,
      onTitleChange,
      editingStep,
      changeEditingStep,
      selectedFileIndex,
      lines,
      draftFiles,
      saveLines,
      addStepImage,
      deleteStepImage,
      saveFileCode,
      codeFiles,
      addFile,
      deleteStepAndFile,
      changeCode,
      changeSelectedFileIndex,
      changeFileLanguage,
      saveFileName,
      onNameChange,
      changeLines,
      moveStepDown,
      updateShowPreview,
      updateShowTags,
    } = this.props;
    return (
      <div>
        <DraftHeader
          username={username}
          updateShowPreview={updateShowPreview}
          updateShowTags={updateShowTags}
          goToPublishedPost={this.goToPublishedPost}
          published={draftPublished}
          publishPost={this.publishDraft}
        />
        <div className={"App"}>
          <div className={"center-divs"}>
            <SlateEditor />
            {/* <MarkdownPreviewExample /> */}
            {/* <PluginEditor /> */}
            <MarkdownPreviewExample />
            <div className={"draft-content"}>
              <Publishing
                draftId={draftId as string}
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
                goToPublishedPost={this.goToPublishedPost}
              />
              <div className={"RightPane"}>
                <CodeEditor
                  addStepImage={addStepImage}
                  deleteStepImage={deleteStepImage}
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
                  currentlyEditingStep={realSteps![editingStep]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let { showPreview } = this.props;

    return (
      <AnimatePresence>
        {!showPreview && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <this.DraftComponent />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}

export default DraftView;
