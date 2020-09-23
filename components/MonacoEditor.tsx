// await import("monaco-editor/esm/vs/editor/editor.api");
// import { ControlledEditor, monaco } from "@monaco-editor/react";
import { Component, createRef } from "react";
import { File, Step } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
import CodeEditor from "./CodeEditor";
import "../styles/codeeditor.scss";
import { editor } from "monaco-editor";
// import { editor, Range } from "monaco-editor";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });
// import ("react-monaco-editor").MonacoEditor;
// import * as monacoEditor from "react-monaco-editor";
// import { Range } from "monaco-editor/esm/vs/editor/editor.api";
// import * as monacoTypes from "monaco-editor/esm/vs/editor/editor.api";
// import {Range} from 'monaco-editor/esm/vs/editor/editor.api';
// const monacoEditor = dynamic((import("monaco-editor/esm/vs/editor/editor.api"));

// import * as monacoEditor from "../typescript/types/monaco_types.api.d.ts";
// const monacoEditor = dynamic(import("monaco-editor/esm/vs/editor/editor.api"), { ssr: false });
// import { Range, editor } from "../typescript/types/monaco_types.api";

// import { editor, Range } from "monaco-editor";
// import Range from "react-monaco-editor";
// const monacoTypes = import("monaco-editor");

type Line = {
  lineNumber: number;
  char: number;
};

type MonacoEditorWrapperState = {
  showModal: boolean;
  // startLine?: Line;
  // endLine?: Line;
};

type MonacoEditorWrapperProps = {
  // highlightLines: (start: any, end: any) => void;
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

var decorations: string[] = [];

export default class MonacoEditorWrapper extends Component<
  MonacoEditorWrapperProps,
  MonacoEditorWrapperState
> {
  private monacoInstance = createRef<editor.IStandaloneCodeEditor>();
  private monacoTypesWrapper!: typeof import("monaco-editor");

  constructor(props: MonacoEditorWrapperProps) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.monacoInstance = createRef();

    this.mountEditor = this.mountEditor.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.saveLines = this.saveLines.bind(this);
    this.updateLines = this.updateLines.bind(this);
  }

  componentDidUpdate(prevProps: MonacoEditorWrapperProps) {
    if (prevProps.selectedFile.id !== this.props.selectedFile.id) {
      this.clearSelections();
    }
  }

  updateLines() {
    let { lines } = this.props;
    console.log(lines);
    decorations = this.monacoInstance.current!.deltaDecorations(decorations, [
      {
        range: new this.monacoTypesWrapper.Range(
          lines.start.lineNumber,
          lines.start.char,
          lines.end.lineNumber,
          lines.end.char
        ),
        options: { isWholeLine: true, inlineClassName: "myLineDecoration" },
      },
    ]);
  }

  clearSelections() {
    this.monacoInstance.current!.setSelections([
      {
        positionColumn: 0,
        positionLineNumber: 0,
        selectionStartColumn: 0,
        selectionStartLineNumber: 0,
      },
    ]);
  }

  mountEditor(
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) {
    (this.monacoInstance as React.MutableRefObject<
      editor.IStandaloneCodeEditor
    >).current = editor;
    this.monacoTypesWrapper = monaco;
    this.updateLines();

    this.monacoInstance.current!.onDidBlurEditorText(() => {
      this.handleBlur();
    });

    this.monacoInstance.current!.onDidChangeCursorSelection((e) =>
      this.handleCursor(e)
    );
  }

  handleBlur() {
    this.props.saveFileCode();
  }

  handleCursor(e: editor.ICursorSelectionChangedEvent) {
    let newSelection = e.selection;
    let { changeLines } = this.props;
    let {
      startLineNumber,
      endLineNumber,
      startColumn,
      endColumn,
    } = newSelection;
    if (!(startLineNumber === endLineNumber && startColumn === endColumn)) {
      this.setState({
        showModal: true,
        // startLine: { lineNumber: startLineNumber, char: startColumn },
        // endLine: { lineNumber: endLineNumber, char: endColumn },
      });
      changeLines({
        start: { lineNumber: startLineNumber, char: startColumn },
        end: { lineNumber: endLineNumber, char: endColumn },
      });
    } else {
      this.setState({ showModal: false });
    }
  }

  saveLines() {
    let { changeLines } = this.props;
    this.props.saveLines(this.props.selectedFile.id, false);
    let selection = this.monacoInstance.current?.getSelection();
    let { startLineNumber, startColumn, endLineNumber, endColumn } = selection!;
    changeLines({
      start: { lineNumber: startLineNumber, char: startColumn },
      end: { lineNumber: endLineNumber, char: endColumn },
    });

    decorations = this.monacoInstance.current!.deltaDecorations(decorations, [
      {
        range: new this.monacoTypesWrapper.Range(
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn
        ),
        options: { isWholeLine: true, inlineClassName: "myLineDecoration" },
      },
    ]);
    this.setState({
      showModal: false,
    });
  }

  LineModal = () => {
    let { start, end } = this.props.lines;
    if (!this.props.editing) {
      return <div></div>;
    }

    if (this.state.showModal) {
      return (
        <div className={"line-modal"}>
          <div className={"adjusted"}>
            <p>
              Highlight lines {start.lineNumber} to {end.lineNumber}?
            </p>
            <button onClick={(e) => this.saveLines()}>
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

  render() {
    let { draftCode, language } = this.props;

    return (
      <div>
        <style jsx>{`
          flex-grow: 100;
          // overflow-y: scroll;
          position: relative;
          background-color: #263238;
          font-size: 12px;
          height: 0px;
        `}</style>
        <this.LineModal />
        <MonacoEditor
          height={"100%"}
          language="typescript"
          theme="monakai"
          value={draftCode}
          onChange={(value) => this.props.changeCode(value)}
          options={{
            selectOnLineNumbers: true,
          }}
          editorDidMount={(editor, monaco) => {
            this.mountEditor(editor, monaco);
            //@ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
              if (label === "json") return "/_next/static/json.worker.js";
              if (label === "css") return "/_next/static/css.worker.js";
              if (label === "html") return "/_next/static/html.worker.js";
              if (label === "typescript" || label === "javascript")
                return "/_next/static/ts.worker.js";
              return "/_next/static/editor.worker.js";
            };
          }}
        />
      </div>
    );
  }
}

// onDidBlurEditorText(listener: () => void): IDisposable;
