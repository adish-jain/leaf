import React, { Component, createRef } from "react";
import dynamic from "next/dynamic";
const StepStyles = require("../styles/Step.module.scss");

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

type EditingStoredStepProps = {
  updateStoredStep: (
    e: React.MouseEvent<HTMLButtonElement>,
    removeLines: any
  ) => void;
  onChange: (stepText: any) => void;
  editorState: any;
  lines: { start: number; end: number };
  saveLines: (fileName: string, remove: boolean) => void;
  attachedFileName: string;
  immediateUpdate: (stepText: string) => void;
  loading: boolean;
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
  }

  saveEditingStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.updateStoredStep(e, this.state.remove);
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
    } = this.props;

    const Buttons = () => {
      return (
        <div className={StepStyles.Buttons}>
          <button
            onClick={(e) => {
              this.saveEditingStoredStep(e);
            }}
            className={StepStyles.Save}
          >
            Save
          </button>
        </div>
      );
    };

    const Lines = () => {
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

    return (
      <div>
        <div className={StepStyles.Step}>
          <div className={StepStyles["editing-draft"]}>
            {
              <DynamicEditor
                // @ts-ignore
                onChange={onChange}
                editorState={editorState}
                immediateUpdate={immediateUpdate}
              />
            }
          </div>
          <Buttons />
          <Lines />
        </div>
      </div>
    );
  }
}
