import React, { Component } from "react";
import { UnControlled as CodeMirror2 } from "react-codemirror2";

type CodeMirrorProps = {};

type CodeMirrorState = {
  value: string;
};

export default class CodeMirror extends Component<CodeMirrorProps, CodeMirrorState> {
  constructor(props: CodeMirrorProps) {
    super(props);

    this.state = {
        value: ''
    }
  }
  render() {
    return (
      <div>
        <CodeMirror2
          value={"testing"}
        //   options={options}
          onBeforeChange={(editor: any, data: any, value: string) => {
            this.setState({ value });
          }}
          onChange={(editor: any, data: any, value: string) => {}}
        />{" "}
      </div>
    );
  }
}
