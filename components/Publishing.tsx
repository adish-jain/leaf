import React, { Component, useContext } from "react";
import TextareaAutosize from "react-autosize-textarea";
import NewStep from "./NewStep";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
import publishingStyles from "../styles/publishing.module.scss";
import { File, Step, Lines } from "../typescript/types/app_types";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { DraftContext } from "../contexts/draft-context";
import { CodeStep } from "../components/CodeStep";
var shortId = require("shortid");

type PublishingProps = {
  codeSteps: contentBlock[];
  sectionIndex: number;
  // what step is currently being edited? -1 means no steps being edited
};

type PublishingState = {
  previewLoading: boolean;
};

export default function Publishing(props: PublishingProps) {
  const { codeSteps, sectionIndex } = props;
  const draftContext = useContext(DraftContext);
  const { currentlyEditingBlock } = draftContext;

  return (
    <div className={publishingStyles["publishing"]}>
      <PublishingDescription />
      <div className={publishingStyles["codesteps"]}>
        {codeSteps.map((codeStep, index) => {
          return (
            <CodeStep
              codeStep={codeStep}
              index={index}
              key={codeStep.backendId}
              sectionIndex={sectionIndex}
              selected={codeStep.backendId === currentlyEditingBlock?.backendId}
              last={index === codeSteps.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}

function PublishingDescription() {
  return (
    <div className={publishingStyles["description"]}>
      <p>
        This is a code step section. Highlight lines in the code editor to pair
        with a step. Scroll down to begin.
      </p>
      {/* <button>Delete Code Section</button> */}
    </div>
  );
}
