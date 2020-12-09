import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useContext,
  createContext,
} from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";
import appStyles from "../styles/app.module.scss";
import { FinishedPostProps } from "../typescript/types/app_types";
import { FinishedPostHeader } from "../components/Headers";
import checkScrollSpeed from "../lib/utils/scrollUtils";
import { DraftContext } from "../contexts/draft-context";
import finishedPostStyles from "../styles/finishedpost.module.scss";
import { ContentContext } from "../contexts/finishedpost/content-context";
import { PublishedFilesContext } from "../contexts/finishedpost/files-context";

type StepDimensions = {
  topY: number;
  bottomY: number;
};

/*
This array keeps track of the top and bottom position of every step.
We use this array to determine what step is currently in the middle of
the screen.
*/

const STEP_MARGIN = 64;

const FinishedPost = (props: FinishedPostProps) => {
  const {
    updatePreviewMode,
    previewMode,
    username,
    title,
    files,
    postContent,
  } = props;

  // scrollspeed is used to determine whether we should animate transitions
  // or scrolling to highlighted lines. If a fast scroll speed, we skip
  // animations.

  const [selectedFileIndex, updateFileIndex] = useState(0);
  const [selectedContentIndex, updateContentIndex] = useState(0);

  const { authenticated, error, loading } = useLoggedIn();
  return (
    <div className={appStyles["finishedpost-wrapper"]}>
      <FinishedPostHeader
        updateShowPreview={updatePreviewMode}
        previewMode={previewMode}
        authenticated={authenticated}
        username={username}
      />
      <PostTitle title={title} />
      <ContentContext.Provider
        value={{
          selectedContentIndex,
          updateContentIndex,
          postContent,
        }}
      >
        <PublishedFilesContext.Provider
          value={{
            updateFileIndex,
            files,
            selectedFileIndex,
          }}
        >
          <div className={finishedPostStyles["content"]}></div>
        </PublishedFilesContext.Provider>
      </ContentContext.Provider>
    </div>
  );
};

export default FinishedPost;

// 30 means that if the page yPos travels more than 30 pixels between
// two onScroll events the scroll speed is above the scroll speed limit
export const SPEED_SCROLL_LIMIT = 30;

function PostTitle(props: { title: string }) {
  const { title } = props;
  return (
    <div className={finishedPostStyles["title"]}>
      <h1>{title}</h1>
    </div>
  );
}

function PostContent() {}
