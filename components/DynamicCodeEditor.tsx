import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";



// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');
require('codemirror/mode/jsx/jsx');

// const codeEditorStyles = require("../styles/CodeEditor.module.scss");
// import "../styles/CodeEditor.module.scss";

type CodeMirrorProps = {
  highlightLines: (
    start: any,
    end: any,
  ) => void;
};

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
  instance: CodeMirror.Editor | undefined;

  constructor(props: CodeMirrorProps) {
    super(props);

    this.instance = undefined;

    this.state = {
      value: jsxString,
    };
  }

  highlightLines(editor: any) {
    let start = editor.getCursor(true);
    let end = editor.getCursor(false);
    this.props.highlightLines(start, end);
  }

  render() {
    return (
      <div>
        <CodeMirror2
          className={"CodeEditor"}
          value={this.state.value}
          options={{
            lineNumbers: true,
            mode: 'jsx',
            theme: 'vscode-dark',
            // theme: 'oceanic-next',
            lineWrapping: true
            // configureMouse: (editor: any, e: any) => {
            //   editor.setSelections(ranges, 0, {
            //     scroll: false,
            //   });
            //   return {
            //     addNew: true,
            //   };
            // },
          }}
          onSelection={(editor, data) => {
            // console.log(editor);
            this.highlightLines(editor);
            // console.log(editor.getCursor(true));
            // console.log(editor.getCursor(false));
          }}

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