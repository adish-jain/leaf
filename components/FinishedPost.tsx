import React, { useState, Component } from "react";
import Scrolling from "./Scrolling";
import animateScrollTo from "animated-scroll-to";
import { useLoggedIn } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import PublishedCodeEditor from "./PublishedCodeEditor";
const appStyles = require("../styles/App.module.scss");

type StepType = {
  text: string;
  id: string;
  lines: { start: number; end: number };
  fileId: string;
  imageURL: string;
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
  username: string;
};

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
        console.log(props.steps[stepIndex]);

        // this is the first step in view, so we break
        break;
      }
    }
  }

  return (
    <div className={appStyles.App}>
      {authenticated ? (
        <Header settings={true} profile={true} username={props.username} />
      ) : (
        <HeaderUnAuthenticated about={true} login={true} signup={true} />
      )}
      <Scrolling
        title={props.title}
        currentStepIndex={currentStepIndex}
        changeStep={changeStep}
        steps={props.steps}
      />
      <div className={appStyles.RightPane}>
        <img src={props.steps[currentStepIndex].imageURL} />
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
