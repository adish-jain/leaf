import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";

require("codemirror/mode/xml/xml");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/jsx/jsx");
require("codemirror/mode/python/python");

// const codeEditorStyles = require("../styles/CodeEditor.module.scss");
// import "../styles/CodeEditor.module.scss";

type CodeMirrorProps = {
  highlightLines: (start: any, end: any) => void;
  saveFileCode: () => void;
  draftCode: string;
  changeCode: (value: string) => void;
  language: string;
};

type CodeMirrorState = {};

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
  }

  highlightLines(editor: any) {
    let start = editor.getCursor(true)["line"] + 1;
    // console.log(editor.getSelection('\n').split("\n"));
    // console.log(editor.getSelection('\n').split("\n").length - 1);
    let end = start + editor.getSelection('\n').split("\n").length - 1;
    // let end = editor.getCursor(false)["line"] + 1;
    this.props.highlightLines(start, end);
  }

  render() {
    let { draftCode, language } = this.props;
    return (
      <div>
        <style jsx>{`
          flex-grow: 100;
        `}</style>
        <CodeMirror2
          className={"CodeEditor"}
          value={draftCode}
          options={{
            lineNumbers: true,
            mode: language,
            theme: "material",
            // theme: 'vscode-dark',
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
          onSelection={(editor, data) => {
            this.highlightLines(editor);
          }}
          editorDidMount={(editor) => {
            this.instance = editor;
            editor.setSize('100%', '100%');
          }}
          onBeforeChange={(editor, data, value) => {
            this.props.changeCode(value);
          }}
          onChange={(editor, data, value) => {}}
          onBlur={() => {
            this.props.saveFileCode();
          }}
        />
      </div>
    );
  }
}
