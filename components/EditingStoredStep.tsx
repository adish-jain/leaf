import React, { Component } from "react";
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
  onHighlight: () => void;
  unHighlight: () => void;
  editorState: any;
};

type EditingStoredStepState = {
  remove: boolean;
  highlight: boolean;
};

export default class Step extends Component<
  EditingStoredStepProps,
  EditingStoredStepState
> {
  constructor(props: EditingStoredStepProps) {
    super(props);
    this.state = { highlight: false, remove: false };
  }

  highlight(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.onHighlight();
    this.setState({
      highlight: true,
    });
  }

  unHighlight(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.unHighlight();
    this.setState({
      highlight: false,
    });
  }

  removeSelect(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      remove: true,
      highlight: false,
    });
  }

  saveEditingStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.updateStoredStep(e, this.state.remove);
    this.setState({
      highlight: false,
    });
  }

  render() {
    let { onChange, editorState } = this.props;
    const highlight = this.state.highlight;
    const remove = this.state.remove;

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

    return (
      <div>
        <div className={StepStyles.Step}>
          <div className={StepStyles.Draft}>
            {
              <DynamicEditor
                // @ts-ignore
                onChange={onChange}
                editorState={editorState}
              />
            }
          </div>
          <Buttons />
        </div>
        <div className={StepStyles["line-indicator"]}>
          <div className={StepStyles["center-indicator"]}>
            <div className={StepStyles["lines-prompt"]}>
              Highlight code in the editor to attach to this step.
            </div>
            <div className={StepStyles["lines-selected"]}>
              No lines currently selected.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
