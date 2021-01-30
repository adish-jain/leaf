import React, { Component, createRef, useContext, useRef } from "react";
import PublishedLanguageBar from "./PublishedLanguageBar";
import PublishedFileBar from "./PublishedFileBar";
import publishedCodeEditorStyles from "../styles/publishedcodeeditor.module.scss";
import rightPaneStyles from "../styles/rightpane.module.scss";
import { File, Step } from "../typescript/types/app_types";
import PrismEditor from "./PrismEditor";
import PublishedImageView from "./PublishedImageView";
import animateScrollTo from "animated-scroll-to";
import { SPEED_SCROLL_LIMIT } from "./FinishedPost";
import { ContentContext } from "../contexts/finishedpost/content-context";
import { MOBILE_WIDTH } from "../pages/_app";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { SectionContext } from "../contexts/section-context";
import { ImageBlockPublished } from "./FinishedPost/ImageBlock";
ImageBlockPublished;
export default function RightPane(props: {
  scrollSpeed: number;
  contentBlockType: ContentBlockType;
}) {
  const { scrollSpeed, contentBlockType } = props;
  const { sectionType } = useContext(SectionContext);
  return (
    <div className={rightPaneStyles["rightpane"]}>
      {sectionType === ContentBlockType.CodeSteps && (
        <PublishedCodeEditor scrollSpeed={scrollSpeed} />
      )}
      {sectionType === ContentBlockType.Image && <ImageBlockPublished />}
    </div>
  );
}

function PublishedCodeEditor(props: { scrollSpeed: number }) {
  const { scrollSpeed } = props;
  const { postContent, selectedContentIndex } = useContext(ContentContext);
  let prismWrapper = useRef<HTMLDivElement>(null);

  function animateLines() {
    let currentContent = postContent[selectedContentIndex];
    let animationOptions = {
      elementToScroll: prismWrapper.current!,
      // add offset so scrolled to line isnt exactly at top
      verticalOffset: -100,
    };
    // each line is around 18 pixels in height, and minus 5 to take into account some padding
    let lineCalc = currentContent?.lines?.start! * 18 - 5;
    if (scrollSpeed > SPEED_SCROLL_LIMIT) {
      prismWrapper.current!.scrollTop = lineCalc;
    } else {
      animateScrollTo(lineCalc, animationOptions);
    }
  }
  return (
    <div className={publishedCodeEditorStyles["editor-wrapper"]}>
      <PublishedImageView
        scrollSpeed={scrollSpeed}
        animateLines={animateLines}
      />
      <PublishedFileBar />
      <PrismEditor prismWrapper={prismWrapper} animateLines={animateLines} />

      {/* <PublishedLanguageBar /> */}
    </div>
  );
}
