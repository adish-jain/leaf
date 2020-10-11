import React, { Component, createRef } from "react";
import dynamic from "next/dynamic";
import "../styles/step.scss";

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

type EditingStoredStepProps = {
  onChange: (stepText: any) => void;
  editorState: any;
  lines?: { start: number; end: number };
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

    const LinesSelected = () => {
      return (
        <div className={"lines-selected"}>
          <p>
            Selected lines {lines?.start || ""} to {lines?.end || ""} in{" "}
            {attachedFileName}
          </p>
          <button className={"clear-lines"} onClick={(e) => saveLines("", true)}>
            Clear selected lines
          </button>
        </div>
      );
    };

    return (
      <div className={"line-indicator"}>
        <div className={"center-indicator"}>
          <div className={"lines-wrapper"}>
            <div className={"title-with-divider"}>
              <label>Line Options</label>
              <div></div>
            </div>
            {!lines ? (
              <div className={"lines-prompt"}>
                Highlight code in the editor to attach to this step.
              </div>
            ) : (
              <LinesSelected />
            )}
          </div>
        </div>
      </div>
    );
  };

  BlockOptions = () => {
    return (
      <div className={"block-options"}>
        <div className={"title-with-divider"}>
          <label>Block Options</label>
          <div></div>
        </div>
        <label className={"block-options-header"}>Block type:</label>
        <select className={"change-block"} onChange={this.handleChange}>
          <option value="no_block">No Block</option>
          <option value="code_editor">Code Editor</option>
        </select>
      </div>
    );
  };

  EndButtons = () => {
    let { loading, changeEditingStep } = this.props;
    return (
      <div className={"end-buttons"}>
        <button
          onClick={(e) => {
            changeEditingStep(-1);
          }}
          className={"save-button"}
        >
          Done Editing
        </button>
        <div className={"loading"}>
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
      updateShowBlock,
    } = this.props;

    return (
      <div className={"editingstep-wrapper"}>
        <div className={"step-border"}>
          <div className={"step-content"}>
            <div className={"title-with-divider"}>
              <label>text</label>
              <div></div>
            </div>
            <div className={"editing-draft"}>
              <DynamicEditor
                // @ts-ignore
                onChange={onChange}
                editorState={editorState}
                immediateUpdate={immediateUpdate}
              />
            </div>
          </div>
          {/* <this.BlockOptions /> */}
          <this.Lines />
        </div>
        <this.EndButtons />
      </div>
    );
  }
}
