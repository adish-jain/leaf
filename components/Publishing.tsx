import React, { Component } from "react";
import TextareaAutosize from "react-autosize-textarea";
import NewStep from "./NewStep";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
import publishingStyles from "../styles/publishing.module.scss";
import { File, Step, Lines } from "../typescript/types/app_types";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import MarkdownSection from "./MarkdownSection";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { DraftContext } from "../contexts/draft-context";

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
  return (
    <div className={publishingStyles["publishing"]}>
      {codeSteps.map((codeStep, index) => {
        return (
          <MarkdownSection
            slateContent={codeStep.slateContent}
            backendId={codeStep.backendId}
            sectionIndex={index + sectionIndex}
            contentType={ContentBlockType.CodeSteps}
            key={codeStep.backendId}
          />
        );
      })}
      {/* {editingStep === -1 ? <NewStep addStep={this.addStep} /> : <div></div>} */}
    </div>
  );
}

function CodeStep() {
  return <div></div>;
}
