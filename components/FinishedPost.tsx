import React, { useState, Component } from "react";
import Scrolling from "./Scrolling";
import animateScrollTo from "animated-scroll-to";

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
  const [currentFileIndex, updateFile] = useState(0);
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
        console.log("updating step");
        updateStep(stepIndex);

        if (editorInstance !== undefined) {
          console.log("updating lines");
          // updateLines();
        }
        else {
          console.log(editorInstance);
        }

        // this is the first step in view, so we break
        break;
      }
    }
  }

  function updateLines() {
    // let { currentStep, currentFile } = this.props;
    let currentStep = props.steps[currentStepIndex];
    let currentFile = props.files[currentFileIndex];

    // clear previous highlighted lines
    for (let i = 0; i < markers.length; i++) {
      markers[i].clear();
    }

    if (currentStep.fileId !== currentFile.id) {
      return;
    }

    // mark new lines
    if (
      currentStep &&
      currentStep.lines !== null &&
      currentStep.lines !== undefined
    ) {
      let newMarker = editorInstance?.markText(
        { line: currentStep.lines.start, ch: 0 },
        { line: currentStep.lines.end, ch: 5 },
        {
          className: "MarkText",
        }
      );
      markers.push(newMarker!);

      // get top position of selected line and scroll to it
      let t = editorInstance!.charCoords(
        { line: currentStep.lines.start, ch: 0 },
        "local"
      ).top;
      let middleHeight = editorInstance!.getScrollerElement().offsetHeight / 2;

      let animationOptions = {
        elementToScroll: editorInstance!.getScrollerElement(),
      };
      console.log("animating");
      animateScrollTo(middleHeight, animationOptions);
    }
  }

  function mountEditor(editor: CodeMirror.Editor) {
    editorInstance = editor;
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
        currentFile={props.files[currentFileIndex]}
        files={props.files}
        currentStep={props.steps[currentStepIndex]}
        updateFile={updateFile}
        editorInstance={editorInstance}
        mountEditor={mountEditor}
      />
    </div>
  );
};

export default FinishedPost;
