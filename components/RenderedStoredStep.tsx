import React, { Component } from "react";
import DraftEditor, { Editor } from "draft-js";
import "../styles/renderedstep.scss";

type RenderedStoredStepProps = {
  changeEditingStep: (editingStep: number) => void;
  deleteStoredStep: (e: React.MouseEvent<any>) => void;
  moveStepUp: () => void;
  moveStepDown: () => void;
  editorState: any;
  lines?: { start: number; end: number };
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

  // Buttons = () => {
  //   let { changeEditingStep, index } = this.props;
  //   return (
  //     <div className={StepStyles.Buttons}>
  //       <div
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           this.props.moveStepUp();
  //         }}
  //         className={StepStyles.Up}
  //       >
  //         ↑
  //       </div>
  //       <div
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           this.props.moveStepDown();
  //         }}
  //         className={StepStyles.Down}
  //       >
  //         ↓
  //       </div>
  //       <div
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           this.props.deleteStoredStep(e);
  //         }}
  //         className={StepStyles.Close}
  //       >
  //         X
  //       </div>
  //     </div>
  //   );
  // };

  LineStatus = () => {
    let { lines, attachedFileName } = this.props;

    if (lines === undefined || lines === null) {
      return (
        <div className={"none-selected"}>
          No lines of code are associated with this step.
        </div>
      );
    } else {
      return (
        <div className={"none-selected"}>
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
        onClick={(e) => changeEditingStep(index)}
        className={"renderedstep-wrapper"}
      >
        <div className={"main-content"}>
          <Editor
            editorState={this.props.editorState}
            readOnly={true}
            onChange={(e) => null}
          />
        </div>
        <label className={"block-status"}>
          Code Editor. No lines selected.
        </label>
        <div className={"divider"}></div>
      </div>
    );
  }
}
