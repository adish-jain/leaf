import React, { useState, Component } from "react";
import Scrolling from "./Scrolling";
import PublishedCodeEditor from "./PublishedCodeEditor";
const appStyles = require("../styles/App.module.scss");

type StepType = {
  text: string;
  id: string;
  lines: { start: number; end: number };
  fileId: string;
};

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type FinishedPostProps = {
  steps: StepType[];
  title: string;
  files: File[];
};

const stepsInView: { [stepIndex: number]: boolean } = {};

const FinishedPost = (props: FinishedPostProps) => {
  const [currentStepIndex, updateStep] = useState(0);
  const [currentFile, updateFile] = useState(0);

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
    <div className={appStyles.App}>
      <Scrolling
        title={props.title}
        currentStepIndex={currentStepIndex}
        changeStep={changeStep}
        steps={props.steps}
      />
      <PublishedCodeEditor
        currentFile={props.files[currentFile]}
        files={props.files}
        currentStep={props.steps[currentStepIndex]}
        updateFile={updateFile}
      />
    </div>
  );
};

export default FinishedPost;
