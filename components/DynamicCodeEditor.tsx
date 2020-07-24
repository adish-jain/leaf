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

type Line = {
  lineNumber: number;
  char: number;
};

type File = {
  id: string;
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type CodeMirrorProps = {
  highlightLines: (start: any, end: any) => void;
  saveFileCode: () => void;
  draftCode: string;
  changeCode: (value: string) => void;
  changeLines: (lines: { start: Line; end: Line }) => void;
  saveLines: (fileName: string, remove: boolean) => void;
  language: string;
  editing: boolean;
  lines: {
    start: Line;
    end: Line;
  };
  selectedFile: File;
};

type CodeMirrorState = {
  showModal: boolean;
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
    };
    this.instance = undefined;
  }

  highlightLines(editor: CodeMirror.Editor) {
    let selectedLines = editor.listSelections();
    let anchor = selectedLines![0].anchor;
    let head = selectedLines![0].head;
    let { changeLines, lines } = this.props;
    let { start, end } = lines;

    // if selection is just a cursor, do not show modal
    if (head.ch === anchor.ch && head.line === anchor.line) {
      this.setState({
        showModal: false,
      });
      return;
    }

    // handle another case where selection is just a cursor
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
      this.setState({
        showModal: false,
      });
      return;
    }

    if (anchor.line > head.line) {
      this.setState({
        showModal: true,
      });
      changeLines({
        start: { lineNumber: head.line + 1, char: head.ch },
        end: { lineNumber: anchor.line + 1, char: anchor.ch },
      });
    } else {
      this.setState({
        showModal: true,
      });
      changeLines({
        start: { lineNumber: anchor.line + 1, char: anchor.ch },
        end: { lineNumber: head.line + 1, char: head.ch },
      });
    }
  }

  handleMouseUp() {
    let editor = this.instance;
    let selectedLines = editor?.listSelections();
    let anchor = selectedLines![0].anchor;
    let head = selectedLines![0].head;
    let { start, end } = this.props.lines;

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

    // closeModal if highlight is in start position
    if (head.ch === anchor.ch && head.line === anchor.line) {
      this.setState({
        showModal: false,
      });
    }
  }

  saveLinesWrapper() {
    this.props.saveLines(this.props.selectedFile.name, false);
    this.setState({
      showModal: false,
    });
  }

  render() {
    let { saveLines } = this.props;
    let { start, end } = this.props.lines;

    const LineModal = () => {
      if (!this.props.editing) {
        return <div></div>;
      }

      if (this.state.showModal) {
        return (
          <div className={CodeEditorStyles["line-modal"]}>
            <div className={CodeEditorStyles["adjusted"]}>
              <p>
                Highlight lines {start.lineNumber} to {end.lineNumber}?
              </p>
              <button onClick={(e) => this.saveLinesWrapper()}>
                Attach highlighted lines to step.
              </button>
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
        <style jsx>{`
          flex-grow: 100;
          overflow-y: scroll;
          position: relative;
          background-color: #263238;
          font-size: 12px;
          height: 0px;
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
