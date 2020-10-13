import React, { useState, Component } from "react";
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

const FinishedPost = (props: FinishedPostProps) => {
  const [currentStepIndex, updateStep] = useState(0);
  const [currentFileIndex, updateFile] = useState(0);
  const { authenticated, error, loading } = useLoggedIn();
  let editorInstance: CodeMirror.Editor | undefined = undefined;
  const markers: CodeMirror.TextMarker[] = [];

  function changeStep(newStep: number, yPos: number, entered: boolean) {
    // stepsInView keeps track of what steps are inside the viewport
    stepsInView[newStep] = entered;

    /* whichever step is the closest to the top of the viewport 
        AND is inside the viewport becomes the selected step */
    for (let step in stepsInView) {
      if (stepsInView[step]) {
        let stepIndex = Number(step);
        let newFileId = props.steps[stepIndex].fileId;
        for (let i = 0; i < props.files.length; i++) {
          if (props.files[i].id === newFileId) {
            updateFile(i);
          }
        }
        updateStep(stepIndex);

        // this is the first step in view, so we break
        break;
      }
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
          changeStep={changeStep}
          steps={props.steps}
        />
        <PublishedCodeEditor
          currentFile={props.files[currentFileIndex]}
          files={props.files}
          currentStep={props.steps[currentStepIndex]}
          updateFile={updateFile}
        />
      </div>
    </div>
  );
};

export default FinishedPost;
