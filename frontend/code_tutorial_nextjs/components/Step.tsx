import React, { Component } from "react";
const StepStyles = require("../styles/Step.module.scss");
import dynamic from "next/dynamic";

// const Editor = dynamic((() => import("./DynamicComponent")) as any, {
//   ssr: false,
// });

// const Editor = dynamic(() =>
//   import('draft-js').then((mod) => mod.Editor)
// )
// const Editor = dynamic(import("draft-js").then(module => module.Editor));

const Editor = dynamic(
  (() => import("draft-js").then((mod) => mod.Editor)) as any,
  {
    ssr: false
  }
);

// const Editor = dynamic(() =>
// import('draft-js').then(mod => mod.Editor), {
//     ssr: false
// })

import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
type StepProps = {};

type StepState = {
  editorState: any;
};

const initialData = {
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
    },
  ],
  entityMap: {},
};

export default class Step extends Component<StepProps, StepState> {
  onChange: any;
  focus: any;
  editor: any;

  constructor(props: StepProps) {
    super(props);

    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(initialData)),
    };

    this.focus = () => this.editor.focus();
    this.onChange = (editorState: any) => this.setState({ editorState });
  }
  render() {
    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles.Draft}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref={(element) => {
              this.editor = element;
            }}
            placeholder="Tell a story..."
          />
        </div>
        <div className={StepStyles.Buttons}>
          <button className={StepStyles.Save}>Save</button>
          <div className={StepStyles.Close}>X</div>
        </div>
        <div></div>
      </div>
    );
  }
}
