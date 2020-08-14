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
  mutateStoredStep: (text: string, stepId: string) => void;
  saveStepToBackend: (stepId: string, text: string) => void;
  deleteStoredStep: (stepId: any) => void;
  moveStepUp: (stepId: any) => void;
  moveStepDown: (stepId: any) => void;
  changeEditingStep: (editingStep: number) => void;
  selectedFileIndex: number;
  saveLines: (fileName: string, remove: boolean) => void;
  files: File[];
  attachedFileId: string;
};

let timer: ReturnType<typeof setTimeout>;
const WAIT_INTERVAL = 3000;

export default class StoredStep extends Component<
  StoredStepProps,
  { loading: boolean }
> {
  constructor(props: StoredStepProps) {
    super(props);
    this.deleteStoredStep = this.deleteStoredStep.bind(this);
    this.updateStoredStep = this.updateStoredStep.bind(this);
    this.moveStepUp = this.moveStepUp.bind(this);
    this.moveStepDown = this.moveStepDown.bind(this);
    this.immediateUpdate = this.immediateUpdate.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);

    this.state = {
      loading: false,
    };
  }

  immediateUpdate(stepText: string) {
    let stepId = this.props.id;
    this.props.mutateStoredStep(stepId, stepText);
    this.props.saveStepToBackend(stepId, stepText);
  }

  // essentially just triggering time
  onChange = (stepText: string) => {
    clearTimeout(timer!);
    timer = setTimeout(() => {
      this.handleTimeout(stepText);
    }, WAIT_INTERVAL);
  };

  handleTimeout(stepText: string) {
    let stepId = this.props.id;
    this.setState(
      {
        loading: true,
      },
      () => {
        this.props.mutateStoredStep(stepId, stepText);
        this.props.saveStepToBackend(stepId, stepText);
        this.setState({
          loading: false,
        });
      }
    );
  }

  deleteStoredStep(e: React.MouseEvent<any>) {
    this.props.deleteStoredStep(this.props.id);
  }

  updateStoredStep(
    e: React.MouseEvent<HTMLButtonElement>,
    removeLines: boolean
  ) {
    let text = this.state.stepText;
    let stepId = this.props.id;
    this.props.mutateStoredStep(stepId, text);

    this.props.changeEditingStep(-1);
  }

  moveStepUp() {
    this.props.moveStepUp(this.props.id);
  }

  moveStepDown() {
    this.props.moveStepDown(this.props.id);
  }

  render() {
    let {
      saveLines,
      files,
      attachedFileId,
      index,
      changeEditingStep,
    } = this.props;
    const contentState = convertFromRaw(this.props.text);
    const editorState = EditorState.createWithContent(contentState);
    const editing = this.props.editing;

    let name = "";
    for (let i = 0; i < files.length; i++) {
      if (files[i].id === attachedFileId) {
        name = files[i].name;
      }
    }

    return (
      <div>
        {editing ? (
          <EditingStoredStep
            updateStoredStep={this.updateStoredStep}
            onChange={this.onChange}
            editorState={editorState}
            lines={this.props.lines}
            saveLines={saveLines}
            attachedFileName={name}
            immediateUpdate={this.immediateUpdate}
            loading={this.state.loading}
          />
        ) : (
          <RenderedStoredStep
            changeEditingStep={changeEditingStep}
            deleteStoredStep={this.deleteStoredStep}
            moveStepUp={this.moveStepUp}
            moveStepDown={this.moveStepDown}
            lines={this.props.lines}
            editorState={editorState}
            attachedFileName={name}
            index={index}
          />
        )}
      </div>
    );
  }
}
