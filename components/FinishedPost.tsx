import React, { useState, useEffect, useCallback } from "react";
import Scrolling from "./Scrolling";
import { useLoggedIn } from "../lib/UseLoggedIn";
import PublishedCodeEditor from "./PublishedCodeEditor";
import "../styles/app.scss";
import "../styles/draftheader.scss";
import { FinishedPostProps } from "../typescript/types/app_types";
import { FinishedPostHeader } from "../components/Headers";
import checkScrollSpeed from "../lib/utils/scrollUtils";

type StepDimensions = {
  topY: number;
  bottomY: number;
};

/*
This array keeps track of the top and bottom position of every step.
We use this array to determine what step is currently in the middle of
the screen.
*/
var stepCoords: StepDimensions[] = [];

const STEP_MARGIN = 64;

const FinishedPost = (props: FinishedPostProps) => {
  const [currentStepIndex, updateStep] = useState(0);
  const [currentFileIndex, updateFile] = useState(0);

  // scrollspeed is used to determine whether we should animate transitions
  // or scrolling to highlighted lines. If a fast scroll speed, we skip
  // animations.
  const [scrollSpeed, updateScrollSpeed] = useState(0);
  const [scrollPosition, updateScrollPosition] = useState(0);
  const scrollingRef = React.useRef<HTMLDivElement>(null);
  const { authenticated, error, loading } = useLoggedIn();

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
    console.log("page Y offset is ", window.pageYOffset);

    console.log(
      "return: page total height is",
      document.documentElement.scrollHeight
    );
    updateScrollPosition(window.pageYOffset);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    console.log("page total height is", document.documentElement.scrollHeight);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    console.log("finding steps");
    findSteps();
    console.log(stepCoords);
  }, []);

  // finds which step is in the middle of the viewport and selects it
  function selectStepIndex(): number {
    let pos = window.pageYOffset + window.innerHeight / 2;
    for (let i = 0; i < stepCoords.length; i++) {
      // if coord is inside step
      if (pos < stepCoords[0].topY) {
        return 0;
      }
      if (
        pos >= stepCoords[i].topY &&
        pos <= stepCoords[i].bottomY + STEP_MARGIN
      ) {
        return i;
      }
    }
    // otherwise, set step to last step
    return stepCoords.length - 1;
  }

  // selects the file associated with the current step
  function selectFileIndex(newStepIndex: number): number {
    let newStep = props.steps[newStepIndex];
    let newFileId = newStep?.fileId;
    for (let j = 0; j < props.files.length; j++) {
      if (props.files[j].id === newFileId) {
        return j;
      }
    }
    // fallback, return first file
    return 0;
  }

  // populates the stepCoords array. Only needs to be run once on mount.
  function findSteps() {
    let children = scrollingRef.current?.children;
    if (children === undefined) {
      return;
    }
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let coords = child.getBoundingClientRect();
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

// 30 means that if the page yPos travels more than 30 pixels between
// two onScroll events the scroll speed is above the scroll speed limit
export const SPEED_SCROLL_LIMIT = 30;
