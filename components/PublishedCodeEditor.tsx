import React, { Component, createRef, useContext, useRef } from "react";
import PublishedLanguageBar from "./PublishedLanguageBar";
import PublishedFileBar from "./PublishedFileBar";
import publishedCodeEditorStyles from "../styles/publishedcodeeditor.module.scss";
import { File, Step } from "../typescript/types/app_types";
import PrismEditor from "./PrismEditor";
import PublishedImageView from "./PublishedImageView";
import animateScrollTo from "animated-scroll-to";
import { SPEED_SCROLL_LIMIT } from "../components/FinishedPost";
import { ContentContext } from "../contexts/finishedpost/content-context";

export default function PublishedCodeEditor(props: { scrollSpeed: number }) {
  let prismWrapper = useRef<HTMLDivElement>(null);
  const { postContent, selectedContentIndex } = useContext(ContentContext);

  const { scrollSpeed } = props;
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
