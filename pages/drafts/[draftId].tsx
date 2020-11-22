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
import { useBackend } from "../../lib/useBackend";
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
import {
  File,
  Step,
  Lines,
  draftBackendRepresentation,
  publishedPostBackendRepresentation,
  backendType,
  timeStamp,
} from "../../typescript/types/app_types";
global.Headers = fetch.Headers;
import Router from "next/router";
import Link from "next/link";
import "../../styles/app.scss";
import "../../styles/draftheader.scss";
import { DraftHeader } from "../../components/Headers";
import { DraftJsButtonProps } from "draft-js-buttons";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-autosize-textarea";

// import SlateEditor from "../../components/SlateSection";
import MarkdownPreviewExample from "../../components/MarkdownSection";

const DraftView = () => {
  const { authenticated, error, loading } = useLoggedIn();
  const router = useRouter();
  // Draft ID
  const { draftId } = router.query;
  // highlighting lines for steps

  // if there are any steps in this draft, they will be fetched & repopulated
  const rawData = {
    requestedAPI: "getDraftMetadata",
    draftId: draftId,
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = (url: string) =>
    fetch("/api/endpoint", myRequest).then((res: any) => res.json());

  const initialData: {
    published: boolean;
    title: string;
    createdAt: timeStamp;
    username: string;
  } = {
    title: "",
    published: false,
    username: "",
    createdAt: {
      _nanoseconds: 0,
      _seconds: 0,
    },
  };

  const { draftContent, updateSlateSectionToBackend } = useBackend(
    authenticated,
    draftId as string
  );

  let { data: draftData, mutate } = useSWR(
    authenticated ? "getDraftMetadata" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  let { onTitleChange, draftTitle } = useDraftTitle(
    draftId as string,
    authenticated
  );

  const errored = draftData["errored"];
  let { toggleTag, tags } = useTags(draftId as string, authenticated);

  // const [shouldShowBlock, updateShowBlock] = useState(false);
  const [showPreview, updateShowPreview] = useState(false);
  const [showTags, updateShowTags] = useState(false);

  // wrapper function for deleting a file.
  // when a file is deleted, make sure all associated steps remove that file

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
                title={draftTitle}
                // tags={tags}
                // username={username}
                files={draftFiles}
                updateShowPreview={updateShowPreview}
                previewMode={true}
                publishedAtSeconds={createdAt.publishedAtSeconds}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {showTags ? (
          <Tags
            showTags={showTags}
            updateShowTags={updateShowTags}
            title={draftTitle}
            selectedTags={tags as string[]}
            toggleTag={toggleTag}
          />
        ) : (
          <DraftContent
            showPreview={showPreview}
            showTags={showTags}
            // username={username}
            tags={tags}
            onTitleChange={onTitleChange}
            draftTitle={draftTitle}
            draftId={draftId as string}
            updateShowPreview={updateShowPreview}
            updateShowTags={updateShowTags}
            draftData={draftData}
            draftContent={draftContent}
            updateSlateSectionToBackend={updateSlateSectionToBackend}
          />
        )}
      </main>
    </div>
  );
};

type DraftContentProps = {
  draftContent: backendType[] | undefined;
  updateSlateSectionToBackend: any;
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

  PublishingHeader = () => {
    let { draftTitle, onTitleChange } = this.props;
    return (
      <div className={"publishing-header"}>
        <TitleLabel />
        <TextareaAutosize
          placeholder={draftTitle}
          value={draftTitle}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
            let myTarget = e.target as HTMLTextAreaElement;
            onTitleChange(myTarget.value);
          }}
          style={{
            fontWeight: "bold",
            fontSize: "40px",
            color: "D0D0D0",
            fontFamily: "sans-serif",
          }}
          name="title"
        />
      </div>
    );
  };

  DraftComponent() {
    let {
      updateShowPreview,
      updateShowTags,
      draftData,
      draftContent,
      updateSlateSectionToBackend,
    } = this.props;

    let errored = draftData["errored"];
    const draftPublished = draftData["published"];
    const postId = draftData["postId"];
    const username = draftData["username"];
    const createdAt = draftData["createdAt"];

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
            <this.PublishingHeader />

            <div className={"draft-content"}>
              {draftContent ? (
                draftContent.map(
                  (contentElement: backendType, index: number) => {
                    switch (contentElement.type) {
                      case "text":
                        return (
                          <MarkdownPreviewExample
                            slateContent={contentElement.slateContent}
                            key={contentElement.backendId}
                            backendId={contentElement.backendId}
                            sectionIndex={index}
                            updateSlateSectionToBackend={
                              updateSlateSectionToBackend
                            }
                          />
                        );
                      case "codestep":
                        return "hi";
                      default:
                        return "test";
                    }
                  }
                )
              ) : (
                <div></div>
              )}
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

const TitleLabel = () => {
  return <label className={"title-label"}>Title</label>;
};

export default DraftView;
