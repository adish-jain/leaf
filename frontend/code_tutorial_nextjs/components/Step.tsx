import React, { Component } from "react";
const StepStyles = require("../styles/Step.module.scss");
import dynamic from "next/dynamic";

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
type StepProps = {
  closeStep: (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => void;
  id: string;
  key: string;
};

type StepState = {};

export default class Step extends Component<StepProps, StepState> {
  onChange: any;
  focus: any;
  editor: any;

  constructor(props: StepProps) {
    super(props);

    this.state = {};

    this.focus = () => this.editor.focus();
    this.onChange = (editorState: any) => this.setState({ editorState });
  }
  render() {
    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles.Draft}>
          <DynamicEditor />
        </div>
        <div className={StepStyles.Buttons}>
          <button className={StepStyles.Save}>Save</button>
          <div onClick={(e) => {this.props.closeStep(e, this.props.id)}} className={StepStyles.Close}>X</div>
        </div>
        <div></div>
      </div>
    );
  }
}
