import React, { Component } from "react";
import { mutate } from "swr";
import { EditorState, convertFromRaw } from "draft-js";
import EditingStoredStep from "./EditingStoredStep";
import RenderedStoredStep from "./RenderedStoredStep";
import "../styles/step.scss";
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
  lines?: { start: number; end: number };
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
  updateShowBlock: (shouldShowBlock: boolean) => void;
};

type StoredStepState = {
  loading: boolean;
  hovered: boolean;
};

// timer to make sure that content is saved 3 seconds after user stops typing
let timer: ReturnType<typeof setTimeout>;
const WAIT_INTERVAL = 500;

export default class StoredStep extends Component<
  StoredStepProps,
  StoredStepState
> {
  constructor(props: StoredStepProps) {
    super(props);
    this.deleteStoredStep = this.deleteStoredStep.bind(this);
    this.moveStepUp = this.moveStepUp.bind(this);
    this.moveStepDown = this.moveStepDown.bind(this);
    this.immediateUpdate = this.immediateUpdate.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);

    this.state = {
      // loading boolean is to allow an indicator to show up
      // when the step is saving content to backend
      loading: false,
      hovered: false,
    };
  }

  // mutates the content, and saves the content to the backend
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
      async () => {
        this.props.mutateStoredStep(stepId, stepText);
        await this.props.saveStepToBackend(stepId, stepText);
        this.setState({
          loading: false,
        });
      }
    );
  }

  deleteStoredStep(e: React.MouseEvent<any>) {
    this.props.deleteStoredStep(this.props.id);
  }

  moveStepUp() {
    this.props.moveStepUp(this.props.id);
  }

  moveStepDown() {
    this.props.moveStepDown(this.props.id);
  }

  // Options = () => {
  //   if (!this.state.hovered) {
  //     return <div></div>;
  //   }
  //   return (
  //     <div className={StepStyles["options"]}>
  //       <div className={StepStyles["dot"]}></div>
  //       <div className={StepStyles["dot"]}></div>
  //       <div className={StepStyles["dot"]}></div>
  //     </div>
  //   );
  // };

  OptionsBar = () => {
    return (
      <div className={"options-bar"}>
        <button>X</button>
        <button>Move up</button>
        <button>Move down</button>
      </div>
    );
  };

  render() {
    let {
      saveLines,
      files,
      attachedFileId,
      index,
      changeEditingStep,
      updateShowBlock,
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
      <div
        className={"step-wrapper"}
        onMouseEnter={(e) => this.setState({ hovered: true })}
        onMouseLeave={(e) => this.setState({ hovered: false })}
      >
        {editing ? (
          <EditingStoredStep
            onChange={this.onChange}
            editorState={editorState}
            lines={this.props.lines}
            saveLines={saveLines}
            attachedFileName={name}
            immediateUpdate={this.immediateUpdate}
            loading={this.state.loading}
            changeEditingStep={changeEditingStep}
            updateShowBlock={updateShowBlock}
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
        {/* <this.OptionsBar /> */}
      </div>
    );
  }
}
