import React, { Component, useContext } from "react";
import TextareaAutosize from "react-autosize-textarea";
import NewStep from "./NewStep";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
import publishingStyles from "../styles/publishing.module.scss";
import stepStyles from "../styles/step.module.scss";
import { File, Step, Lines } from "../typescript/types/app_types";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import MarkdownSection from "./MarkdownSection";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { DraftContext } from "../contexts/draft-context";
import { ContentBlock } from "draft-js";

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
    </div>
  );
}

function CodeStep(props: {
  codeStep: contentBlock;
  index: number;
  sectionIndex: number;
  selected: boolean;
}) {
  const draftContext = useContext(DraftContext);
  const { changeEditingBlock } = draftContext;
  const { codeStep, index, sectionIndex, selected } = props;
  let style = {};
  if (selected) {
    style["color"] = "blue";
  }
  return (
    <div
      className={stepStyles["codestep"]}
      style={style}
      onClick={(e) => {
        changeEditingBlock(codeStep.backendId);
      }}
    >
      <MarkdownSection
        slateContent={codeStep.slateContent}
        backendId={codeStep.backendId}
        sectionIndex={index + sectionIndex}
        contentType={ContentBlockType.CodeSteps}
        key={codeStep.backendId}
      />
    </div>
  );
}
