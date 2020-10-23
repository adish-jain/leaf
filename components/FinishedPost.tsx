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

const stepsInView: { [stepIndex: number]: boolean } = {};

type StepDimensions = {
  topY: number;
  bottomY: number;
};

var stepCoords: StepDimensions[] = [];

const FinishedPost = (props: FinishedPostProps) => {
  const [currentStepIndex, updateStep] = useState(0);
  const [currentFileIndex, updateFile] = useState(0);
  const [scrollPosition, updateScrollPosition] = useState(0);
  const scrollingRef = React.useRef<HTMLDivElement>(null);
  const { authenticated, error, loading } = useLoggedIn();
  let editorInstance: CodeMirror.Editor | undefined = undefined;
  const markers: CodeMirror.TextMarker[] = [];

  const handleScroll = useCallback((event) => {
    // updateScrollPosition(window.pageYOffset);
    selectStep();
  }, []);

  function findSelectedStep() {}

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    findSteps();
  }, []);

  function selectStep() {
    let pos = window.pageYOffset + window.innerHeight / 2;
    for (let i = 0; i < stepCoords.length; i++) {
      if (pos >= stepCoords[i].topY - 64 && pos <= stepCoords[i].bottomY) {
        updateStep(i);
        let newFileId = props.steps[i].fileId;
        for (let j = 0; j < props.files.length; j++) {
          if (props.files[j].id === newFileId) {
            updateFile(j);
          }
        }
        return;
      }
    }
    updateStep(stepCoords.length - 1);
    return;
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
          // changeStep={changeStep}
          steps={props.steps}
          updateStep={updateStep}
          username={props.username}
          scrollingRef={scrollingRef}
          publishedAtSeconds={props.publishedAtSeconds}
        />
        <PublishedCodeEditor
          currentFileIndex={currentFileIndex}
          files={props.files}
          steps={props.steps}
          currentStepIndex={currentStepIndex}
          updateFile={updateFile}
        />
      </div>
    </div>
  );
};

export default FinishedPost;
