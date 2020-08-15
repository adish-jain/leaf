import React, { Component } from "react";
import DraftEditor, { Editor } from "draft-js";
const StepStyles = require("../styles/Step.module.scss");

type RenderedStoredStepProps = {
  changeEditingStep: (editingStep: number) => void;
  deleteStoredStep: (e: React.MouseEvent<any>) => void;
  moveStepUp: () => void;
  moveStepDown: () => void;
  editorState: any;
  lines: { start: number; end: number };
  attachedFileName: string;
  index: number;
};

type RenderedStoredStepState = {};

export default class Step extends Component<
  RenderedStoredStepProps,
  RenderedStoredStepState
> {
  constructor(props: RenderedStoredStepProps) {
    super(props);
  }

  Buttons = () => {
    let { changeEditingStep, index } = this.props;
    return (
      <div className={StepStyles.Buttons}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            changeEditingStep(index);
          }}
          className={StepStyles.Save}
        >
          Edit
        </button>
        <div
          onClick={(e) => {
            e.stopPropagation();
            this.props.moveStepUp();
          }}
          className={StepStyles.Up}
        >
          ↑
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            this.props.moveStepDown();
          }}
          className={StepStyles.Down}
        >
          ↓
        </div>
        <div
          onClick={(e) => {
            this.props.deleteStoredStep(e);
          }}
          className={StepStyles.Close}
        >
          X
        </div>
      </div>
    );
  };

  LineStatus = () => {
    let { lines, attachedFileName } = this.props;

    if (lines === undefined || lines === null) {
      return (
        <div className={StepStyles["none-selected"]}>
          No lines of code are associated with this step.
        </div>
      );
    } else {
      return (
        <div className={StepStyles["none-selected"]}>
          <style jsx>{`
            color: white;
            background-color: #37abda;
          `}</style>
          Selected lines {lines.start} to {lines.end} in {attachedFileName}
        </div>
      );
    }
  };

  render() {
    let { lines, attachedFileName, index, changeEditingStep } = this.props;

    return (
      <div
        onClick={(e) => {
          console.log("wrapper click");
          changeEditingStep(index);
        }}
        className={StepStyles.Step}
      >
        <div className={StepStyles["main-content"]}>
          <div className={StepStyles.Draft}>
            <Editor
              editorState={this.props.editorState}
              readOnly={true}
              onChange={(e) => null}
            />
          </div>
          <this.Buttons />
        </div>
        <this.LineStatus />
      </div>
    );
  }
}
