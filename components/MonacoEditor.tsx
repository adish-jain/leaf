// import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
// import { ControlledEditor, monaco } from "@monaco-editor/react";
import { Component, createRef } from "react";
import { File, Step } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
import CodeEditor from "./CodeEditor";
import "../styles/codeeditor.scss";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

type Line = {
  lineNumber: number;
  char: number;
};

type MonacoEditorState = {
  showModal: boolean;
  // startLine?: Line;
  // endLine?: Line;
};

type MonacoEditorProps = {
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

export default class MonacoEditorWrapper extends Component<
  MonacoEditorProps,
  MonacoEditorState
> {
  private monacoInstance = createRef<
    monacoEditor.editor.IStandaloneCodeEditor
  >();

  constructor(props: MonacoEditorProps) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.monacoInstance = createRef();

    this.mountEditor = this.mountEditor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.saveLines = this.saveLines.bind(this);
  }

  handleChange(
    ev: monacoEditor.editor.IModelContentChangedEvent,
    value: string | undefined
  ) {
    this.props.changeCode(value!);
  }

  mountEditor(
    getEditorValue: () => string,
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) {
    (this.monacoInstance as React.MutableRefObject<
      monacoEditor.editor.IStandaloneCodeEditor
    >).current = editor;

    this.monacoInstance.current!.onDidBlurEditorText(() => {
      this.handleBlur();
    });

    this.monacoInstance.current!.onDidChangeCursorSelection((e) =>
      this.handleCursor(e)
    );

    var decorations = editor.deltaDecorations(
      [],
      [
        {
          range: new monacoEditor.Range(3, 1, 5, 1),
          options: {
            isWholeLine: true,
            linesDecorationsClassName: null,
          },
        },
        {
          range: new monacoEditor.Range(7, 1, 7, 24),
          options: { inlineClassName: null },
        },
      ]
    );
  }

  handleBlur() {
    this.props.saveFileCode();
  }

  handleCursor(e: monacoEditor.editor.ICursorSelectionChangedEvent) {
    let newSelection = e.selection;
    console.log(newSelection);
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
        <div className={CodeEditorStyles["line-modal"]}>
          <div className={CodeEditorStyles["adjusted"]}>
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
      <MonacoEditor
        height={"100%"}
        language="typescript"
        theme="monakai"
        value={draftCode}
        onChange={console.log}
        options={{
          selectOnLineNumbers: true,
        }}
        editorDidMount={() => {
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
    );
  }
}

// onDidBlurEditorText(listener: () => void): IDisposable;
