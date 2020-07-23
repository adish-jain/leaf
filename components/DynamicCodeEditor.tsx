import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";
import CodeEditorStyles from "../styles/CodeEditor.module.scss";
import { EDOM } from "constants";

import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/mode/go/go.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/php/php.js";
import "codemirror/mode/ruby/ruby.js";
import "codemirror/mode/textile/textile.js";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/python/python";

// const codeEditorStyles = require("../styles/CodeEditor.module.scss");
// import "../styles/CodeEditor.module.scss";

type CodeMirrorProps = {
  highlightLines: (start: any, end: any) => void;
  saveFileCode: () => void;
  draftCode: string;
  changeCode: (value: string) => void;
  language: string;
  editing: boolean;
};

type Line = {
  lineNumber: number;
  char: number;
};

type CodeMirrorState = {
  showModal: boolean;
  end: Line;
  start: Line;
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
    this.state = {
      showModal: false,
      start: { lineNumber: 0, char: 0 },
      end: { lineNumber: 0, char: 0 },
    };
    this.instance = undefined;
  }

  highlightLines(editor: CodeMirror.Editor) {
    let lines = editor.listSelections();
    let anchor = lines![0].anchor;
    let head = lines![0].head;
    let { start, end } = this.state;
    console.log(lines);

    if (head.ch === anchor.ch && head.line === anchor.line) {
      this.setState({
        showModal: false,
      });
      return;
    }

    let equalSelectionsCaseOne =
      start.lineNumber - 1 === anchor.line &&
      start.char === anchor.ch &&
      end.lineNumber - 1 === head.line &&
      end.char === head.ch;
    let equalSelectionsCaseTwo =
      start.lineNumber - 1 === head.line &&
      start.char === head.ch &&
      end.lineNumber - 1 === anchor.line &&
      end.char === anchor.ch;

    if (equalSelectionsCaseOne || equalSelectionsCaseTwo) {
      console.log("equal selection");
      this.setState({
        showModal: false,
      });
      return;
    }

    if (anchor.line > head.line) {
      this.setState({
        showModal: true,
        end: { lineNumber: anchor.line + 1, char: anchor.ch },
        start: { lineNumber: head.line + 1, char: head.ch },
      });
    } else {
      this.setState({
        showModal: true,
        start: { lineNumber: anchor.line + 1, char: anchor.ch },
        end: { lineNumber: head.line + 1, char: head.ch },
      });
    }

    // this.props.highlightLines(start, end);
  }

  handleMouseUp() {
    let editor = this.instance;
    let lines = editor?.listSelections();
    // console.log(lines);
    let anchor = lines![0].anchor;
    let head = lines![0].head;
    let { start, end } = this.state;

    // handle case where clicking inside selection
    let equalSelectionsCaseOne =
      start.lineNumber - 1 === anchor.line &&
      start.char === anchor.ch &&
      end.lineNumber - 1 === head.line &&
      end.char === head.ch;
    let equalSelectionsCaseTwo =
      start.lineNumber - 1 === head.line &&
      start.char === head.ch &&
      end.lineNumber - 1 === anchor.line &&
      end.char === anchor.ch;

    // if (equalSelectionsCaseOne || equalSelectionsCaseTwo) {
    //   console.log("equal selection");
    //   this.setState({
    //     showModal: false,
    //   });
    //   return;
    // }

    // closeModal if highlight is in start position
    if (!(head.ch === anchor.ch && head.line === anchor.line)) {
      // if (anchor.line > head.line) {
      //   this.setState({
      //     showModal: true,
      //     end: { lineNumber: anchor.line + 1, char: anchor.ch },
      //     start: { lineNumber: head.line + 1, char: head.ch },
      //   });
      // } else {
      //   this.setState({
      //     showModal: true,
      //     start: { lineNumber: anchor.line + 1, char: anchor.ch },
      //     end: { lineNumber: head.line + 1, char: head.ch },
      //   });
      // }
    } else {
      console.log("start position");
      this.setState({
        showModal: false,
      });
    }
  }

  render() {
    const LineModal = () => {
      if (!this.props.editing) {
        return <div></div>;
      }

      if (this.state.showModal) {
        return (
          <div className={CodeEditorStyles["line-modal"]}>
            <div className={CodeEditorStyles["adjusted"]}>
              <p>
                Highlight lines {this.state.start.lineNumber} to{" "}
                {this.state.end.lineNumber}?
              </p>
              <button>Attach highlighted lines to step.</button>
              <button>X</button>
            </div>
          </div>
        );
      } else {
        return <div></div>;
      }
    };

    let { draftCode, language } = this.props;
    return (
      <div onMouseUp={this.handleMouseUp.bind(this)}>
        {/* <div> */}
        <style jsx>{`
          flex-grow: 100;
          overflow-y: scroll;
          position: relative;
          background-color: #263238;
          font-size: 12px;
        `}</style>
        <LineModal />
        <CodeMirror2
          className={"CodeEditor"}
          value={draftCode}
          // value = {this.state.value}
          options={{
            lineNumbers: true,
            mode: language,
            // theme: "solarized",
            theme: "monokai-sublime",
            // theme: "material",
            // theme: 'vscode-dark',
            // theme: 'oceanic-next',
            lineWrapping: true,
            matchBrackets: true,
            autoCloseBrackets: true,
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
            if (this.props.editing) {
              this.highlightLines(editor);
            }
          }}
          editorDidMount={(editor) => {
            this.instance = editor;
            editor.setSize("100%", "100%");
          }}
          onBeforeChange={(editor, data, value) => {
            this.props.changeCode(value);
          }}
          onChange={(editor, data, value) => {}}
          onBlur={() => {
            this.props.saveFileCode();
          }}
          onDragLeave={(editor, event) => {
            console.log("drag left");
          }}
        />
      </div>
    );
  }
}
