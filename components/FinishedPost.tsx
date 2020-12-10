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
import Link from "next/link";
import dayjs from "dayjs";
import {
  contentBlock,
  contentSection,
} from "../typescript/types/frontend/postTypes";
import { FrontendSectionType } from "../typescript/enums/frontend/postEnums";
import {
  CodeSection,
  TextSection as TextSectionType,
} from "../typescript/types/frontend/postTypes";
import PublishedCodeStepSection from "./PublishedCodeSection";
import PublishedTextSection from "./PublishedTextSection";

const FinishedPost = (props: FinishedPostProps) => {
  const {
    updatePreviewMode,
    previewMode,
    username,
    title,
    files,
    postContent,
    profileImage,
    publishedAtSeconds,
    tags,
  } = props;
  // scrollspeed is used to determine whether we should animate transitions
  // or scrolling to highlighted lines. If a fast scroll speed, we skip
  // animations.

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
    <div className={appStyles["finishedpost-wrapper"]}>
      <FinishedPostHeader
        updatePreviewMode={updatePreviewMode}
        previewMode={previewMode}
        authenticated={authenticated}
        username={username}
      />
      <ContentContext.Provider
        value={{
          selectedContentIndex,
          updateContentIndex,
          postContent,
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
          <div className={finishedPostStyles["introduction"]}>
            <PostTitle title={title} />
            <PostIntro />
            <PostTags />
          </div>
          <PostContent scrollSpeed={scrollSpeed} />
        </PublishedFilesContext.Provider>
      </ContentContext.Provider>
    </div>
  );
};

function PostContent(props: { scrollSpeed: number }) {
  const { scrollSpeed } = props;
  const { postContent } = useContext(ContentContext);
  const arrangedPostContent = arrangeContentList(postContent);

  return (
    <div>
      {arrangedPostContent.map((contentElement, index: number) => {
        switch (contentElement.type) {
          case FrontendSectionType.TextSection: {
            contentElement.type;
            const slateContent = (contentElement as contentSection &
              TextSectionType).slateSection.slateContent;
            const backendId = (contentElement as contentSection &
              TextSectionType).slateSection.backendId;
            const startIndex = contentElement.startIndex;
            return (
              <PublishedTextSection
                slateContent={slateContent}
                key={backendId}
                backendId={backendId}
                startIndex={startIndex}
              />
            );
          }
          case FrontendSectionType.CodeSection: {
            const codeSteps = (contentElement as contentSection & CodeSection)
              .codeSteps;
            const startIndex = contentElement.startIndex;
            return (
              <PublishedCodeStepSection
                scrollSpeed={scrollSpeed}
                codeSteps={codeSteps}
                key={codeSteps[0].backendId}
                startIndex={startIndex}
              />
            );
          }

          default:
            return "test";
        }
      })}
    </div>
  );
}

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

function PostIntro() {
  const { username, profileImage, publishedAtSeconds } = useContext(
    ContentContext
  );
  let date = new Date(publishedAtSeconds * 1000);
  let formattedDate = dayjs(date).format("MMMM D YYYY");
  console.log(profileImage);
  return (
    <div className={finishedPostStyles["published-by"]}>
      <span> {"Published by "}</span>
      <Link href={`/${username}`}>
        <div className={finishedPostStyles["author-name-and-img"]}>
          {profileImage !== "" && profileImage !== null && (
            <div className={finishedPostStyles["published-post-author-img"]}>
              <img src={profileImage} />
            </div>
          )}
          <a>{username}</a>
        </div>
      </Link>
      <span>on {formattedDate}</span>
    </div>
  );
}

function PostTags(props: {}) {
  const { tags } = useContext(ContentContext);
  return (
    <div className={finishedPostStyles["post-tags"]}>
      {tags === null || tags === undefined ? (
        <div></div>
      ) : (
        tags.map((tag: string) => (
          <div key={tag} className={finishedPostStyles["post-tag"]}>
            {tag}
          </div>
        ))
      )}
    </div>
  );
}

function arrangeContentList(draftContent: contentBlock[]): contentSection[] {
  // iterate through array

  // if code step type
  // add to sub array

  // if not code step type, break sub array
  let finalArray: contentSection[] = [];
  let subArray: contentBlock[] = [];
  let runningSum = 0;
  for (let i = 0; i < draftContent.length; i++) {
    if (draftContent[i].type === "codestep") {
      // aggregate codesteps into subArray
      subArray.push(draftContent[i]);
      // runningSum += 1;
    } else {
      if (subArray.length > 0) {
        finalArray.push({
          type: FrontendSectionType.CodeSection,
          codeSteps: subArray,
          startIndex: runningSum,
        });
        runningSum += subArray.length;
      }
      subArray = [];
      finalArray.push({
        type: FrontendSectionType.TextSection,
        slateSection: draftContent[i],
        startIndex: runningSum,
      });
      runningSum += 1;
    }
  }
  if (subArray.length > 0) {
    finalArray.push({
      type: FrontendSectionType.CodeSection,
      codeSteps: subArray,
      startIndex: runningSum,
    });
  }
  return finalArray;
}
