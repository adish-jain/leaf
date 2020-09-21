// await import("monaco-editor/esm/vs/editor/editor.api");
// import { ControlledEditor, monaco } from "@monaco-editor/react";
import { Component, createRef } from "react";
import { File, Step } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
import CodeEditor from "./CodeEditor";
import "../styles/codeeditor.scss";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });
// import { editor, Range } from "monaco-editor";
// import Range from "react-monaco-editor";
// const monacoTypes = import("monaco-editor");

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
  private monacoInstance = createRef<any>();
  private monacoTypesWrapper: any;

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

  handleChange(ev: any, value: string | undefined) {
    this.props.changeCode(value!);
  }

  mountEditor(editor: any, monaco: any) {
    (this.monacoInstance as React.MutableRefObject<any>).current = editor;

    this.monacoInstance.current!.onDidBlurEditorText(() => {
      this.handleBlur();
    });

    this.monacoInstance.current!.onDidChangeCursorSelection((e) =>
      this.handleCursor(e, monaco)
    );

    this.monacoTypesWrapper = monaco;
  }

  handleBlur() {
    this.props.saveFileCode();
  }

  handleCursor(e: any) {
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

    // let oldDecorations = this.monacoInstance.current!.deltaDecorations([], [
    //   { range: new this.monacoTypesWrapper.Range(1, 1, 1, 1), options: {} },
    // ]);

    var elems = document.querySelectorAll(".myLineDecoration");
    [].forEach.call(elems, function (el: any) {
      el.classList.remove("myLineDecoration");
    });

    let decorations = this.monacoInstance.current!.deltaDecorations(
      [],
      [
        {
          range: new this.monacoTypesWrapper.Range(
            startLineNumber,
            startColumn,
            endLineNumber,
            endColumn
          ),
          options: { isWholeLine: true, inlineClassName: "myLineDecoration" },
        },
      ]
    );
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
          onChange={console.log}
          options={{
            selectOnLineNumbers: true,
          }}
          editorDidMount={(editor, monaco) => {
            this.mountEditor(editor, monaco);
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
