import React, { Component } from "react";
import { mutate } from "swr";
import { EditorState, convertFromRaw } from "draft-js";
import EditingStoredStep from "./EditingStoredStep";
import RenderedStoredStep from "./RenderedStoredStep";
const StepStyles = require("../styles/Step.module.scss");
const fetch = require("node-fetch");

type File = {
  id: string;
  language: string; //replace with enum
  code: string;
  name: string;
};

type StoredStepProps = {
  editing: boolean;
  id: string;
  draftId: string;
  text: any;
  lines: { start: number; end: number };
  index: number;
  updateStoredStep: (
    text: any,
    stepId: any,
    oldLines: any,
    removeLines: any
  ) => void;
  deleteStoredStep: (stepId: any) => void;
  moveStepUp: (stepId: any) => void;
  moveStepDown: (stepId: any) => void;
  changeEditingStep: (editingStep: number) => void;
  selectedFile: File;
  attachedFileName: string;
  saveLines: (fileName: string, remove: boolean) => void;
};

type StoredStepState = {
  stepText: any;
};

export default class StoredStep extends Component<
  StoredStepProps,
  StoredStepState
> {
  constructor(props: StoredStepProps) {
    super(props);
    this.deleteStoredStep = this.deleteStoredStep.bind(this);
    this.editStoredStep = this.editStoredStep.bind(this);
    this.updateStoredStep = this.updateStoredStep.bind(this);
    this.moveStepUp = this.moveStepUp.bind(this);
    this.moveStepDown = this.moveStepDown.bind(this);
    this.state = {
      stepText: this.props.text,
    };
  }

  onChange = (stepText: any) => {
    this.setState({
      stepText,
    });
  };

  deleteStoredStep(e: React.MouseEvent<any>) {
    this.props.deleteStoredStep(this.props.id);
  }

  editStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.changeEditingStep(this.props.index);
  }

  updateStoredStep(
    e: React.MouseEvent<HTMLButtonElement>,
    removeLines: boolean
  ) {
    let text = this.state.stepText;
    let stepId = this.props.id;
    this.props.updateStoredStep(stepId, text, this.props.lines, removeLines);

    this.props.changeEditingStep(-1);
  }

  moveStepUp() {
    this.props.moveStepUp(this.props.id);
  }

  moveStepDown() {
    this.props.moveStepDown(this.props.id);
  }

  render() {
    let { saveLines, attachedFileName } = this.props;
    const contentState = convertFromRaw(this.props.text);
    const editorState = EditorState.createWithContent(contentState);
    const editing = this.props.editing;
    return (
      <div>
        {editing ? (
          <EditingStoredStep
            updateStoredStep={this.updateStoredStep}
            onChange={this.onChange}
            editorState={editorState}
            lines={this.props.lines}
            saveLines={saveLines}
            attachedFileName={attachedFileName}
          />
        ) : (
          <RenderedStoredStep
            editStoredStep={this.editStoredStep}
            deleteStoredStep={this.deleteStoredStep}
            moveStepUp={this.moveStepUp}
            moveStepDown={this.moveStepDown}
            lines={this.props.lines}
            editorState={editorState}
            attachedFileName={attachedFileName}
          />
        )}
      </div>
    );
  }
}
