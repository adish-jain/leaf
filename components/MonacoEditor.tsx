import { Component, createRef } from "react";
import { File, Step, Lines } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
import "../styles/codeeditor.scss";
import { editor } from "monaco-editor";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import { getMonacoLanguageFromBackend } from "../lib/utils/languageUtils";

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
  changeLines: (lines: Lines) => void;
  saveLines: (fileName: string, remove: boolean) => void;
  language: string;
  editing: boolean;
  lines: Lines;
  selectedFile: File;
  currentlyEditingStep?: Step;
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
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.onresize = this.handleResize;
    // this.handleResize();
  }

  handleResize() {
    this.monacoInstance.current?.layout();
  }

  componentDidUpdate(prevProps: MonacoEditorWrapperProps) {
    if (this.monacoInstance.current === null) {
      return;
    }

    // if selected file changes
    if (prevProps.selectedFile.id !== this.props.selectedFile.id) {
      // clear selections

      this.clearLines();
      if (
        this.props.selectedFile.id === this.props.currentlyEditingStep?.fileId
      ) {
        this.updateLines();
      }

      this.clearSelections();
      return;
    }

    // if no step is selected
    if (this.props.currentlyEditingStep === undefined) {
      this.clearLines();
      return;
    }

    // if current step changes
    if (
      prevProps.currentlyEditingStep?.id !== this.props.currentlyEditingStep.id
    ) {
      this.clearLines();
      this.updateLines();
      return;
    }

    // if current file is not the step file, clear lines
    if (this.props.currentlyEditingStep.fileId !== this.props.selectedFile.id) {
      return;
    }

    // if lines update
    let oldLines = prevProps.currentlyEditingStep.lines;
    let oldStart = oldLines?.start;
    let oldEnd = oldLines?.end;

    let currentLines = this.props.currentlyEditingStep.lines;
    let currentStart = currentLines?.start;
    let currentEnd = currentLines?.end;

    if (oldStart !== currentStart || oldEnd !== currentStart) {
      this.clearLines();
      this.updateLines();
      return;
    }
  }

  updateLines() {
    let { currentlyEditingStep } = this.props;
    if (!currentlyEditingStep) {
      return;
    }
    let lines = currentlyEditingStep.lines;
    if (lines) {
      decorations = this.monacoInstance.current!.deltaDecorations(decorations, [
        {
          range: new this.monacoTypesWrapper.Range(
            lines.start,
            0,
            lines.end,
            0
          ),
          options: { isWholeLine: true, inlineClassName: "myLineDecoration" },
        },
      ]);
    }
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

  clearLines() {
    decorations = this.monacoInstance.current!.deltaDecorations(decorations, [
      {
        range: new this.monacoTypesWrapper.Range(0, 0, 0, 0),
        options: { isWholeLine: false, inlineClassName: "myLineDecoration" },
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

    //disables typescript type checking
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
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
    // update lines for modal
    if (!(startLineNumber === endLineNumber && startColumn === endColumn)) {
      this.setState({
        showModal: true,
      });
      changeLines({
        start: startLineNumber,
        end: endLineNumber,
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
      start: startLineNumber,
      end: endLineNumber,
    });

    this.setState({
      showModal: false,
    });
  }

  LineModal = () => {
    let { start, end } = this.props.lines;

    return (
      <AnimatePresence>
        {this.state.showModal && this.props.editing && (
          <motion.div
            style={{
              position: "absolute",
              margin: "auto",
              // bottom: 0,
              // right: 0,
              left: "30%",
              zIndex: 1,
            }}
            initial={{
              bottom: "-40px",
              opacity: 0,
            }}
            animate={{
              bottom: "40px",
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              bottom: "0px",
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <div className={"line-modal"}>
              <div className={"adjusted"}>
                <p>
                  Highlight lines {start} to {end}?
                </p>
                <button onClick={(e) => this.saveLines()}>
                  Attach highlighted lines to step.
                </button>
                <button
                  onClick={(e) => {
                    this.setState({ showModal: false });
                  }}
                >
                  X
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  render() {
    let { draftCode, language } = this.props;
    return (
      <div>
        <style jsx>{`
          position: relative;
          // background-color: #263238;
          font-size: 12px;
          height: 100%;
          resize: vertical;
          overflow: hidden;
        `}</style>
        <this.LineModal />
        <MonacoEditor
          height={"100%"}
          language={getMonacoLanguageFromBackend(language)}
          value={draftCode}
          onChange={(value) => this.props.changeCode(value)}
          options={{
            selectOnLineNumbers: true,
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
          }}
          editorDidMount={(editor, monaco) => {
            this.mountEditor(editor, monaco);
            //@ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
              if (label === "html") return "/_next/static/html.worker.js";
              if (label === "css") return "/_next/static/css.worker.js";
              if (label === "scss") return "/_next/static/css.worker.js";
              if (label === "yaml") return "/_next/static/yaml.worker.js";
              if (label === "json") return "/_next/static/ts.worker.js";
              if (label === "typescript" || label === "javascript")
                return "/_next/static/ts.worker.js";
              if (label === "python") return "/_next/static/python.worker.js";
              if (label === "java") return "/_next/static/java.worker.js";
              if (label === "go") return "/_next/static/go.worker.js";
              if (label === "ruby") return "/_next/static/ruby.worker.js";
              if (label === "php") return "/_next/static/php.worker.js";
              if (label === "rust") return "/_next/static/rust.worker.js";
              if (label === "objective-c")
                return "/_next/static/objective-c.worker.js";
              if (label === "rust") return "/_next/static/rust.worker.js";
              if (label === "swift") return "/_next/static/swift.worker.js";
              if (label === "dockerfile")
                return "/_next/static/dockerfile.worker.js";
              if (label === "markdown")
                return "/_next/static/markdown.worker.js";
              return "/_next/static/editor.worker.js";
            };
          }}
        />
      </div>
    );
  }
}

// onDidBlurEditorText(listener: () => void): IDisposable;
