import React, { Component } from "react";
import { Editor } from "draft-js";
const StepStyles = require("../styles/Step.module.scss");

type RenderedStoredStepProps = {
  editStoredStep: (e: React.MouseEvent<HTMLButtonElement>) => void;
  deleteStoredStep: (e: React.MouseEvent<any>) => void;
  moveStepUp: () => void;
  moveStepDown: () => void;
  editorState: any;
  lines: { start: number; end: number };
};

type RenderedStoredStepState = {};

export default class Step extends Component<
  RenderedStoredStepProps,
  RenderedStoredStepState
> {
  constructor(props: RenderedStoredStepProps) {
    super(props);
    // console.log(this.props.lines);
  }

  render() {
    let { lines } = this.props;

    const Buttons = () => {
      return (
        <div className={StepStyles.Buttons}>
          <button
            onClick={(e) => {
              this.props.editStoredStep(e);
            }}
            className={StepStyles.Save}
          >
            Edit
          </button>
          <div
            onClick={(e) => {
              this.props.moveStepUp();
            }}
            className={StepStyles.Up}
          >
            ↑
          </div>
          <div
            onClick={(e) => {
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

    const LineStatus = () => {
      if (lines === null) {
        return (
          <div className={StepStyles["none-selected"]}>
            No lines of code are associated with this step.
          </div>
        );
      } else {
        return <div></div>;
      }
    };

    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles["main-content"]}>
          <div className={StepStyles.Draft}>
            {
              // @ts-ignore
              <Editor editorState={this.props.editorState} readOnly={true} />
            }
          </div>
          <Buttons />
        </div>
        <LineStatus />
      </div>
    );
  }
}
