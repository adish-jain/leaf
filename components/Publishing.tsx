import React, { Component, useContext } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { NewStep } from "./NewStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
import publishingStyles from "../styles/publishing.module.scss";
import { File, Step, Lines } from "../typescript/types/app_types";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { CodeStep } from "../components/CodeStep";
import { AnimateSharedLayout, motion } from "framer-motion";
import { start } from "repl";
import { DraftContent } from "./DraftContent";
import { DraftContext } from "../contexts/draft-context";
import Preview from "./Preview";
import { PreviewContext } from "./preview-context";
var shortId = require("shortid");

type PublishingProps = {
  codeSteps: contentBlock[];
  startIndex: number;
  // what step is currently being edited? -1 means no steps being edited
};

type PublishingState = {
  previewLoading: boolean;
};

export default function Publishing(props: PublishingProps) {
  const { codeSteps, startIndex } = props;
  const draftContext = useContext(DraftContext);
  const { currentlyEditingBlock } = draftContext;
  const { previewMode } = useContext(PreviewContext);
  return (
    <div className={publishingStyles["publishing"]}>
      {!previewMode && <PublishingDescription />}
      {/* <AnimateSharedLayout> */}
      <motion.div
        className={publishingStyles["codesteps"]}
        //  layout
      >
        {codeSteps.map((codeStep, index) => {
          return (
            <CodeStep
              codeStep={codeStep}
              index={index}
              key={codeStep.backendId}
              startIndex={startIndex}
              selected={codeStep.backendId === currentlyEditingBlock?.backendId}
              last={index === codeSteps.length - 1}
              backendId={codeStep.backendId}
            />
          );
        })}
      </motion.div>
      {!previewMode && (
        <NewStep
          lastStepId={codeSteps[codeSteps.length - 1].backendId}
          lastIndex={startIndex + codeSteps.length - 1}
        />
      )}
      {/* </AnimateSharedLayout> */}
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
