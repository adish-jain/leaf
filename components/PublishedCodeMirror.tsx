import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";

// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');
require("codemirror/mode/jsx/jsx");

// const codeEditorStyles = require("../styles/CodeEditor.module.scss");
// import "../styles/CodeEditor.module.scss";

type CodeMirrorProps = {
  currentStep: number;
  currentFile: File;
};

type CodeMirrorState = {
  value: string;
};

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
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

export default class PublishedCodeMirror extends Component<
  CodeMirrorProps,
  CodeMirrorState
> {
  instance: any;

  constructor(props: CodeMirrorProps) {
    super(props);

    this.instance = null;

    this.state = {
      value: jsxString,
    };
  }

  componentDidUpdate(prevProps: CodeMirrorProps) {
    let { currentStep } = this.props;

    // console.log("step was", prevProps.currentStep, "step now is", currentStep);

    this.instance.markText(
      { line: currentStep, ch: 0 },
      { line: currentStep, ch: 5 },
      {
        className: "MarkText",
      }
    );
  }

  render() {
    return (
      <div>
        <style jsx>{`
          flex-grow: 100;
          overflow-y: scroll;
          position: relative;
          background-color: #263238;
          font-size: 12px;
          height: auto;
        `}</style>
        <CodeMirror2
          className={"CodeEditor"}
          value={this.state.value}
          options={{
            lineNumbers: true,
            mode: "jsx",
            theme: "monokai-sublime",
            // theme: 'oceanic-next',
            lineWrapping: true,
            // configureMouse: (editor: any, e: any) => {
            //   editor.setSelections(ranges, 0, {
            //     scroll: false,
            //   });
            //   return {
            //     addNew: true,
            //   };
            // },
          }}
          onSelection={(editor, data) => {}}
          editorDidMount={(editor) => {
            this.instance = editor;
            editor.markText(
              { line: 0, ch: 0 },
              { line: 1, ch: 0 },
              {
                className: "MarkText",
              }
            );
            editor.setSize("100%", "100%");
          }}
          scroll={{
            y: 0,
          }}
          onBeforeChange={(editor, data, value) => {
            editor.markText(
              { line: 0, ch: 0 },
              { line: this.props.currentStep, ch: 0 },
              {
                className: "MarkText",
              }
            );
            this.setState({
              value,
            });
          }}
        />
      </div>
    );
  }
}
