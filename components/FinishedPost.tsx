import React, { useState, useEffect, useCallback, useRef } from "react";
import Scrolling from "./Scrolling";
import animateScrollTo from "animated-scroll-to";
import { useLoggedIn } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import PublishedCodeEditor from "./PublishedCodeEditor";
import "../styles/app.scss";
import "../styles/draftheader.scss";
import { File, Step, FinishedPostProps } from "../typescript/types/app_types";
import Link from "next/link";
import { FinishedPostHeader } from "../components/Headers";
import checkScrollSpeed from "../lib/utils/scrollUtils";

const stepsInView: { [stepIndex: number]: boolean } = {};

type StepDimensions = {
  topY: number;
  bottomY: number;
};

var stepCoords: StepDimensions[] = [];

const FinishedPost = (props: FinishedPostProps) => {
  const [currentStepIndex, updateStep] = useState(0);
  const [currentFileIndex, updateFile] = useState(0);
  const [scrollSpeed, updateScrollSpeed] = useState(0);
  const [scrollPosition, updateScrollPosition] = useState(0);
  const scrollingRef = React.useRef<HTMLDivElement>(null);
  const { authenticated, error, loading } = useLoggedIn();
  let editorInstance: CodeMirror.Editor | undefined = undefined;
  const markers: CodeMirror.TextMarker[] = [];

  const handleScroll = useCallback((event) => {
    // select new step
    let newStepIndex = selectStepIndex();
    updateStep(newStepIndex);

    // select new file
    let newFileIndex = selectFileIndex(newStepIndex);
    updateFile(newFileIndex);

    // update scroll speed
    let scrollSpeed = checkScrollSpeed();
    updateScrollSpeed(scrollSpeed);

    // update scroll position
    updateScrollPosition(window.pageYOffset);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    findSteps();
  }, []);

  function selectStepIndex(): number {
    let pos = window.pageYOffset + window.innerHeight / 2;
    for (let i = 0; i < stepCoords.length; i++) {
      // if coord is inside step
      if (pos < stepCoords[0].topY) {
        return 0;
      }
      if (pos >= stepCoords[i].topY && pos <= stepCoords[i].bottomY + 64) {
        return i;
      }
    }
    // otherwise, set step to last step
    return stepCoords.length - 1;
  }

  function selectFileIndex(newStepIndex: number): number {
    let newFileId = props.steps[newStepIndex].fileId;
    for (let j = 0; j < props.files.length; j++) {
      if (props.files[j].id === newFileId) {
        return j;
      }
    }
    // fallback, return first file
    return 0;
  }

  function findSteps() {
    let children = scrollingRef.current?.children;
    if (children === undefined) {
      return;
    }
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let coords = child.getBoundingClientRect();
      // let centerCoord = coords.top + coords.height / 2;
      // stepCoords.push(centerCoord);
      stepCoords.push({
        topY: coords.top,
        bottomY: coords.bottom,
      });
    }
  }

  return (
    <div className={"finishedpost-wrapper"}>
      <FinishedPostHeader
        updateShowPreview={props.updateShowPreview}
        previewMode={props.previewMode}
        authenticated={authenticated}
        username={props.username}
      />
      <div className={"center-divs"}>
        <Scrolling
          title={props.title}
          currentStepIndex={currentStepIndex}
          steps={props.steps}
          username={props.username}
          scrollingRef={scrollingRef}
          publishedAtSeconds={props.publishedAtSeconds}
          pageYOffset={scrollPosition}
        />
        <PublishedCodeEditor
          currentFileIndex={currentFileIndex}
          files={props.files}
          steps={props.steps}
          currentStepIndex={currentStepIndex}
          updateFile={updateFile}
          scrollSpeed={scrollSpeed}
        />
      </div>
    </div>
  );
};

export default FinishedPost;
