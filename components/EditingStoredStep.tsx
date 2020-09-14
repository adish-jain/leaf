import React, { Component, createRef } from "react";
import dynamic from "next/dynamic";
const StepStyles = require("../styles/Step.module.scss");

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

type EditingStoredStepProps = {
  onChange: (stepText: any) => void;
  editorState: any;
  lines: { start: number; end: number };
  saveLines: (fileName: string, remove: boolean) => void;
  attachedFileName: string;
  immediateUpdate: (stepText: string) => void;
  loading: boolean;
  changeEditingStep: (editingStep: number) => void;
};

type EditingStoredStepState = {
  remove: boolean;
};

export default class Step extends Component<
  EditingStoredStepProps,
  EditingStoredStepState
> {
  constructor(props: EditingStoredStepProps) {
    super(props);
    this.state = { remove: false };

    this.handleChange = this.handleChange.bind(this);
  }

  Lines = () => {
    let { lines, attachedFileName, saveLines } = this.props;

    return (
      <div className={StepStyles["line-indicator"]}>
        <div className={StepStyles["center-indicator"]}>
          {!lines ? (
            <div className={StepStyles["lines-wrapper"]}>
              <div className={StepStyles["lines-prompt"]}>
                Highlight code in the editor to attach to this step.
              </div>
              <div className={StepStyles["lines-selected"]}>
                No lines currently selected.
              </div>
            </div>
          ) : (
            <div className={StepStyles["lines-wrapper"]}>
              <div className={StepStyles["lines-prompt"]}></div>
              <div className={StepStyles["lines-selected"]}>
                <p>
                  Selected lines {lines.start} to {lines.end} in{" "}
                  {attachedFileName}
                </p>
                <button
                  className={StepStyles["Close"]}
                  onClick={(e) => saveLines("", true)}
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  handleChange(e: React.FormEvent<HTMLSelectElement>) {}

  render() {
    let {
      onChange,
      editorState,
      lines,
      saveLines,
      attachedFileName,
      immediateUpdate,
      loading,
      changeEditingStep,
    } = this.props;

    const Buttons = () => {
      return (
        <div className={StepStyles.Buttons}>
          <button
            onClick={(e) => {
              changeEditingStep(-1);
            }}
            className={StepStyles["save-button"]}
          >
            Done Editing
          </button>
          <div className={StepStyles["loading"]}>
            {loading ? "Saving content..." : "Content Saved."}
          </div>
        </div>
      );
    };

    return (
      <div>
        <div className={StepStyles["step-content"]}>
          <div className={StepStyles["editing-draft"]}>
            <DynamicEditor
              // @ts-ignore
              onChange={onChange}
              editorState={editorState}
              immediateUpdate={immediateUpdate}
            />
          </div>
          <Buttons />
          {/* <Lines /> */}
        </div>
        <div className={StepStyles["block-options"]}>
          <label className={StepStyles["title"]}>Block Options</label>
          <div className={StepStyles["divider"]}></div>
          <label className={StepStyles["header"]}>Block type:</label>
          <select
            className={StepStyles["change-block"]}
            onChange={this.handleChange}
          >
            <option value="no_block">No Block</option>
            <option value="code_editor">Code Editor</option>
          </select>
        </div>
      </div>
    );
  }
}
