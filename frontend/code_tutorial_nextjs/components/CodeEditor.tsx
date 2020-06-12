import React, { Component } from "react";
import dynamic from "next/dynamic";

const DynamicComponent = dynamic((() => import("./DynamicComponent")) as any, {
  ssr: false,
});

type CodeEditorProps = {};

type CodeEditorState = {
  code: string;
};

export default class CodeEditor extends Component<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {
      code: "",
    };
  }

  render() {
    const code = this.state.code;

    return (
      <div>
        <DynamicComponent />
      </div>
    );
  }
}
