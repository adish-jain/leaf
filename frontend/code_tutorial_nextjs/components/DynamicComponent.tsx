import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString } from "./code_string";
// const codeEditorStyles = require("../styles/CodeEditor.module.scss");
// import "../styles/CodeEditor.module.scss";

type CodeMirrorProps = {};

type CodeMirrorState = {
  value: string;
};

const ranges = [
  {
    anchor: { ch: 0, line: 0 },
    head: { ch: 0, line: 1 },
  },
  {
    anchor: { ch: 0, line: 1 },
    head: { ch: 0, line: 2 },
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
          className={"CodeEditor"}
          value={this.state.value}
          options={{
            lineNumbers: true,
            // configureMouse: (editor: any, e: any) => {
            //   editor.setSelections(ranges, 0, {
            //     scroll: false,
            //   });
            //   return {
            //     addNew: true,
            //   };
            // },
          }}
          // selection={{
          //   ranges: ranges,
          //   focus: true, // defaults false if not specified
          // }}
          onSelection={(editor, data) => {
            console.log(editor);
          }}
          // onScroll={(editor, data) => {
          //   console.log("onscroll fired");
          //   console.log(data);
          // }}
          editorDidMount={(editor) => {
            this.instance = editor;
            editor.markText(
              { line: 0, ch: 0 },
              { line: 1, ch: 0 },
              {
                className: "MarkText",
              }
            );
            editor.setSize(608, 531);
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({
              value,
            });
          }}
        />
      </div>
    );
  }
}
