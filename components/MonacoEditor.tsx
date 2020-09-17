import { monaco, ControlledEditorOnChange } from "@monaco-editor/react";
// import monacoEditor from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { ControlledEditor } from "@monaco-editor/react";
import { Component, createRef } from "react";
import { File, Step } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
import CodeEditor from "./CodeEditor";
import CodeEditorStyles from "../styles/CodeEditor.module.scss";
// const ControlledEditor = dynamic(
//   () =>
//     import("@monaco-editor/react").then((mod) => mod.ControlledEditor) as any,
//   {
//     ssr: false,
//   }
// );

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

export default class MonacoEditor extends Component<
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
        <ControlledEditor
          value={draftCode}
          onChange={this.handleChange}
          editorDidMount={this.mountEditor}
        />
      </div>
    );
  }
}

// onDidBlurEditorText(listener: () => void): IDisposable;
