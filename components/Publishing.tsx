import React, { Component } from "react";
import TextareaAutosize from "react-autosize-textarea";
import NewStep from "./NewStep";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
import "../styles/publishing.scss";
import { File, Step, Lines } from "../typescript/types/app_types";

var shortId = require("shortid");

type PublishingProps = {
  draftId: string;
  title: string;
  storedSteps: Step[];
  // what step is currently being edited? -1 means no steps being edited
  editingStep: number;
  changeEditingStep: (editingStep: number) => void;
  saveStep: (stepId: string, text: string) => void;
  mutateStoredStep: (stepId: string, text: string) => void;
  saveStepToBackend: (stepId: string, text: string) => void;
  deleteStoredStep: (stepId: any) => void;
  moveStepUp: (stepId: any) => void;
  moveStepDown: (stepId: any) => void;
  onTitleChange: (title: string) => void;
  selectedFileIndex: number;
  lines: Lines;
  saveLines: (fileName: string, remove: boolean) => void;
  files: File[];
  published: boolean;
  goToPublishedPost: () => void;
};

type PublishingState = {
  previewLoading: boolean;
};

type PublishingComponent = {
  publishingComponentType: PublishingComponentType;
};

enum PublishingComponentType {
  step = "step",
}

export default class Publishing extends Component<
  PublishingProps,
  PublishingState
> {
  constructor(props: PublishingProps) {
    super(props);

    this.addStep = this.addStep.bind(this);
    this.closeStep = this.closeStep.bind(this);

    this.state = {
      previewLoading: false,
    };
  }

  closeStep(stepId: string) {
    this.props.deleteStoredStep(stepId);
  }

  addStep(e: React.MouseEvent<HTMLButtonElement>) {
    let stepId = shortId.generate();

    let emptyJSON = {
      blocks: [
        {
          key: stepId,
          text: "Enter content here",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    };

    this.props.saveStep(stepId, JSON.stringify(emptyJSON));
  }

  render() {
    let {
      storedSteps,
      editingStep,
      selectedFileIndex,
      files,
      onTitleChange,
      changeEditingStep,
      saveLines,
      mutateStoredStep,
      saveStepToBackend,
      deleteStoredStep,
    } = this.props;

    return (
      <div className={"publishing"}>
        {storedSteps.map((storedStep, index) => {
          return (
            <StoredStep
              id={storedStep.id}
              index={index}
              draftId={this.props.draftId}
              text={JSON.parse(storedStep.text)}
              lines={storedStep.lines}
              deleteStoredStep={deleteStoredStep}
              mutateStoredStep={mutateStoredStep}
              saveStepToBackend={saveStepToBackend}
              moveStepUp={this.props.moveStepUp}
              moveStepDown={this.props.moveStepDown}
              key={storedStep.id}
              editing={editingStep === index}
              changeEditingStep={changeEditingStep}
              selectedFileIndex={selectedFileIndex}
              files={files}
              saveLines={saveLines}
              attachedFileId={storedStep.fileId!}
              lastStep={index === storedSteps.length - 1}
              firstStep={index === 0}
            />
          );
        })}
        {editingStep === -1 ? <NewStep addStep={this.addStep} /> : <div></div>}
      </div>
    );
  }
}
