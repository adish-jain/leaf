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
  updateShowBlock: (shouldShowBlock: boolean) => void;
};

type EditingStoredStepState = {
  remove: boolean;
  codeEditor: boolean;
};

export default class Step extends Component<
  EditingStoredStepProps,
  EditingStoredStepState
> {
  constructor(props: EditingStoredStepProps) {
    super(props);
    this.state = { remove: false, codeEditor: false };

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
              {/* <div className={StepStyles["lines-selected"]}>
                No lines currently selected.
              </div> */}
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

  BlockOptions = () => {
    return (
      <div className={StepStyles["block-options"]}>
        <div className={StepStyles["title-with-divider"]}>
          <label>Block Options</label>
          <div></div>
        </div>
        <label className={StepStyles["header"]}>Block type:</label>
        <select
          className={StepStyles["change-block"]}
          onChange={this.handleChange}
        >
          <option value="no_block">No Block</option>
          <option value="code_editor">Code Editor</option>
        </select>
      </div>
    );
  };

  EndButtons = () => {
    let { loading, changeEditingStep } = this.props;
    return (
      <div className={StepStyles["end-buttons"]}>
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

  handleChange(e: React.FormEvent<HTMLSelectElement>) {
    // this.setState({
    //   codeEditor: true
    // });

    this.props.updateShowBlock(true);
  }

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
      updateShowBlock
    } = this.props;

    return (
      <div className={StepStyles["editingstep-wrapper"]}>
        <div className={StepStyles["step-border"]}>
          <div className={StepStyles["step-content"]}>
            <div className={StepStyles["title-with-divider"]}>
              <label>text</label>
              <div></div>
            </div>
            <div className={StepStyles["editing-draft"]}>
              <DynamicEditor
                // @ts-ignore
                onChange={onChange}
                editorState={editorState}
                immediateUpdate={immediateUpdate}
              />
            </div>
          </div>
          <this.BlockOptions />
          <this.Lines />
        </div>

        <this.EndButtons />
        {/* <div className={StepStyles["divider"]}></div> */}
      </div>
    );
  }
}
