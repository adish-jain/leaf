import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString } from "./code_string";

type CodeMirrorProps = {};

type CodeMirrorState = {
  value: string;
};

const ranges = [
  {
    anchor: { ch: 0, line: 0 },
    head: { ch: 80, line: 0 },
  },
  {
    anchor: { ch: 0, line: 1 },
    head: { ch: 80, line: 1 },
  },
];

const rangetest = {};

export default class CodeMirror extends Component<
  CodeMirrorProps,
  CodeMirrorState
> {
  instance: any;

  constructor(props: CodeMirrorProps) {
    super(props);

    this.instance = null;

    this.state = {
      value: reactString,
    };
  }
  render() {
    return (
      <div>
        <CodeMirror2
          value={this.state.value}
          options={{
            lineNumbers: true,
            configureMouse: (editor: any, e: any) => {
              editor.setSelections(ranges, 0, {
                scroll: false,
              });
              return {
                addNew: true,
              };
            },
          }}
          selection={{
            ranges: ranges,
            focus: false, // defaults false if not specified
          }}
          onSelection={(editor, data) => {
            console.log(data);
          }}
          onScroll={(editor, data) => {
            console.log("onscroll fired");
            console.log(data);
          }}
          editorDidMount={(editor) => {
            this.instance = editor;
            editor.setSize(608, 531);
          }}
          onBeforeChange={(editor, data) => {}}
        />
      </div>
    );
  }
}
