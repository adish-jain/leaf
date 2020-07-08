import React, { useState, Component } from "react";
import Scrolling from "./Scrolling";
import PublishedCodeEditor from "./PublishedCodeEditor";
const appStyles = require("../styles/App.module.scss");

type StepType = {
  text: string;
  id: string;
};

type FinishedStepProps = {
  steps: StepType[];
  title: string;
};

const stepsInView: { [stepIndex: number]: boolean } = {};

const FinishedPost = (props: FinishedStepProps) => {
  const [currentStep, updateStep] = useState(0);

  function changeStep(newStep: number, yPos: number, entered: boolean) {
    // stepsInView keeps track of what steps are inside the viewport
    stepsInView[newStep] = entered;

    /* whichever step is the closest to the top of the viewport 
        AND is inside the viewport becomes the selected step */
    for (let step in stepsInView) {
      if (stepsInView[step]) {
        updateStep(Number(step));
        break;
      }
    }
  }

  return (
    <div className={appStyles.App}>
      <Scrolling
        title={props.title}
        currentStep={currentStep}
        changeStep={changeStep}
        steps={props.steps}
      />
      <PublishedCodeEditor currentStep={currentStep} />
    </div>
  );
};

export default FinishedPost;
