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

import { ContentContext } from "../contexts/finishedpost/content-context";
import { PublishedFilesContext } from "../contexts/finishedpost/files-context";
import Link from "next/link";
import { PreviewContext } from "./preview-context";
import { DimensionsContext } from "../contexts/dimensions-context";
import { PostContent } from "./FinishedPost/PostContent";
import { Introduction } from "./FinishedPost/Introduction";
import { PostBody } from "./FinishedPost/PostBody";
import { DomainContext } from "../contexts/domain-context";
import { deSerializePostContent } from "../lib/useBackend";

const FinishedPost = (props: FinishedPostProps) => {
  const {
    updatePreviewMode,
    previewMode,
    username,
    title,
    files,
    postContent: serializedPostContent,
    profileImage,
    publishedAtSeconds,
    tags,
    published,
    publishedView,
    userHost,
    onCustomDomain,
  } = props;
  // scrollspeed is used to determine whether we should animate transitions
  // or scrolling to highlighted lines. If a fast scroll speed, we skip
  // animations.

  const deSerializedPostContent = deSerializePostContent(serializedPostContent);

  const [selectedFileIndex, updateFileIndex] = useState(0);
  const [selectedContentIndex, updateContentIndex] = useState(0);
  const [scrollSpeed, updateScrollSpeed] = useState(0);
  const scrollingRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((event) => {
    // update scroll speed
    let scrollSpeed = checkScrollSpeed();
    updateScrollSpeed(scrollSpeed);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const { authenticated, error, loading } = useLoggedIn();
  return (
    <DomainContext.Provider
      value={{
        username: username,
        userHost,
        onCustomDomain,
      }}
    >
      <PreviewContext.Provider
        value={{
          previewMode,
          updatePreviewMode: updatePreviewMode,
          published,
          publishedView,
        }}
      >
        <div className={appStyles["finishedpost-wrapper"]}>
          <ContentContext.Provider
            value={{
              selectedContentIndex,
              updateContentIndex,
              postContent: deSerializedPostContent,
              username,
              profileImage,
              publishedAtSeconds,
              tags,
            }}
          >
            <PublishedFilesContext.Provider
              value={{
                updateFileIndex,
                files,
                selectedFileIndex,
              }}
            >
              <FinishedPostHeader
                updatePreviewMode={updatePreviewMode}
                previewMode={previewMode}
                authenticated={authenticated}
                username={username}
              />
              <PostBody scrollSpeed={scrollSpeed} title={title} />
            </PublishedFilesContext.Provider>
          </ContentContext.Provider>
        </div>
      </PreviewContext.Provider>
    </DomainContext.Provider>
  );
};

export default FinishedPost;

// 30 means that if the page yPos travels more than 30 pixels between
// two onScroll events the scroll speed is above the scroll speed limit
export const SPEED_SCROLL_LIMIT = 30;
