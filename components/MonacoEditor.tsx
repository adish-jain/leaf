import { Component, createRef } from "react";
import { File, Step, Lines } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
import "../styles/codeeditor.scss";
import { editor } from "monaco-editor";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import { getMonacoLanguageFromBackend } from "../lib/utils/languageUtils";
const shortId = require("shortid");

import { DraftContext } from "../contexts/draft-context";
import { FilesContext } from "../contexts/files-context";
import {
  contentBlock,
  fileObject,
} from "../typescript/types/frontend/postTypes";
const shortid = require("shortid");

type MonacoEditorWrapperState = {
  showModal: boolean;
  // startLine?: Line;
  // endLine?: Line;
};

type MonacoEditorWrapperProps = {
  // highlightLines: (start: any, end: any) => void;
  draftCode: string;
  selectedFile: fileObject | undefined;
  currentlySelectedLines: Lines;
  changeSelectedLines: React.Dispatch<React.SetStateAction<Lines>>;
  currentlyEditingBlock: contentBlock | undefined;
  saveFileCode: () => void;
  changeCode: (value: string) => void;
};

var decorations: string[] = [];

export default class MonacoEditorWrapper extends Component<
  MonacoEditorWrapperProps,
  MonacoEditorWrapperState
> {
  // static contextType = DraftContext;
  // context!: React.ContextType<typeof DraftContext>;
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

    const { currentlyEditingBlock } = this.props;

    // if selected file changes
    if (prevProps.selectedFile?.fileId !== this.props.selectedFile?.fileId) {
      // clear selections

      this.clearLines();
      if (this.props.selectedFile?.fileId === currentlyEditingBlock?.fileId) {
        this.updateLines();
      }

      this.clearSelections();
      return;
    }

    // if no step is selected
    if (currentlyEditingBlock === undefined) {
      this.clearLines();
      return;
    }

    // if current step changes
    if (
      prevProps.currentlyEditingBlock?.backendId !==
      this.props.currentlyEditingBlock?.backendId
    ) {
      this.clearLines();
      this.updateLines();
      return;
    }

    // if current file is not the step file, clear lines
    if (
      this.props.currentlyEditingBlock?.fileId !==
      this.props.selectedFile?.fileId
    ) {
      return;
    }

    // if lines update
    let oldLines = prevProps.currentlyEditingBlock?.lines;
    let oldStart = oldLines?.start;
    let oldEnd = oldLines?.end;

    let currentLines = this.props.currentlyEditingBlock?.lines;
    let currentStart = currentLines?.start;
    let currentEnd = currentLines?.end;

    if (oldStart !== currentStart || oldEnd !== currentStart) {
      this.clearLines();
      this.updateLines();
      return;
    }
  }

  updateLines() {
    let { currentlyEditingBlock } = this.props;
    if (!currentlyEditingBlock) {
      return;
    }
    let lines = currentlyEditingBlock.lines;
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
    console.log("mounting editor");
    (this
      .monacoInstance as React.MutableRefObject<editor.IStandaloneCodeEditor>).current = editor;
    this.monacoTypesWrapper = monaco;
    this.updateLines();

    this.monacoInstance.current!.onDidBlurEditorText(() => {
      this.handleBlur();
    });

    this.monacoInstance.current!.onDidChangeCursorSelection((e) =>
      this.handleCursor(e)
    );

    // //disables typescript type checking
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
    let { changeSelectedLines } = this.props;
    let {
      startLineNumber,
      endLineNumber,
      startColumn,
      endColumn,
    } = newSelection;
    // update lines for modal
    if (!(startLineNumber === endLineNumber && startColumn === endColumn)) {
      // this.setState({
      //   showModal: true,
      // });
      changeSelectedLines({
        start: startLineNumber,
        end: endLineNumber,
      });
    } else {
      // this.setState({ showModal: false });
    }
  }

  saveLines() {
    let { changeSelectedLines } = this.props;
    this.props.saveLines(this.props.selectedFile.id, false);
    let selection = this.monacoInstance.current?.getSelection();
    let { startLineNumber, startColumn, endLineNumber, endColumn } = selection!;
    changeSelectedLines({
      start: startLineNumber,
      end: endLineNumber,
    });

    this.setState({
      showModal: false,
    });
  }

  LineModal = () => {
    const { currentlyEditingBlock } = this.props;
    const { start, end } = this.props.currentlySelectedLines;
    return (
      <AnimatePresence>
        {this.state.showModal && currentlyEditingBlock && (
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
    // const { selectedFile } = this.fileContext;
    const { selectedFile, changeCode, currentlySelectedLines } = this.props;
    const code = selectedFile?.code;
    const language = selectedFile?.language;
    if (!selectedFile) {
      console.log("no selected file");
      return <div></div>;
    }
    // console.log(selectedFile.fileId + language);
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
        {/* <this.LineModal /> */}
        <EncloseMonaco
          selectedFile={selectedFile}
          changeCode={changeCode}
          mountEditor={this.mountEditor}
          currentlySelectedLines={currentlySelectedLines}
        />
      </div>
    );
  }
}

type EncloseMonacoProps = {
  selectedFile: fileObject;
  changeCode: (value: string) => void;
  // mountEditor: (
  //   editor: editor.IStandaloneCodeEditor,
  //   monaco: typeof import("monaco-editor")
  // ) => void;
  mountEditor: any;
  currentlySelectedLines: Lines;
};

class EncloseMonaco extends Component<EncloseMonacoProps> {
  shouldComponentUpdate(nextProps: EncloseMonacoProps, nextState: any) {
    console.log("checking if should render");
    const nextLines = nextProps.currentlySelectedLines;
    const currLines = this.props.currentlySelectedLines;
    if (!linesAreEqual(nextLines, currLines)) {
      console.log("preventing rerender");
      return false;
    }
    return true;
  }

  render() {
    const { selectedFile, changeCode, mountEditor } = this.props;
    const { code, language } = selectedFile;
    return (
      <MonacoEditor
        key={shortId.generate()}
        height={"100%"}
        language={getMonacoLanguageFromBackend(language || "")}
        value={code || ""}
        onChange={(value) => changeCode(value)}
        options={{
          selectOnLineNumbers: true,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
        }}
        editorWillMount={(monaco) => {
          console.log("editor will mount");
        }}
        editorDidMount={(editor, monaco) => {
          mountEditor(editor, monaco);
          //@ts-ignore
          window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
            if (label === "html") return "/_next/static/html.worker.js";
            if (label === "xml") return "/_next/static/xml.worker.js";
            if (label === "css") return "/_next/static/css.worker.js";
            if (label === "scss") return "/_next/static/css.worker.js";
            if (label === "json") return "/_next/static/json.worker.js";
            if (label === "typescript" || label === "javascript")
              return "/_next/static/ts.worker.js";
            return "/_next/static/editor.worker.js";
          };
        }}
      />
    );
  }
}

function linesAreEqual(first: Lines, second: Lines) {
  if (first.start === second.start && first.end === second.end) {
    return true;
  }
  return false;
}

// onDidBlurEditorText(listener: () => void): IDisposable;
