import { File, Step } from "../typescript/types/app_types";
import React, { Component, createRef } from "react";
import dynamic from "next/dynamic";
import { editor } from "monaco-editor";
import "../styles/codeeditor.scss";
import animateScrollTo from "animated-scroll-to";

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

type PublishedMonacoEditorProps = {
  currentFile: File;
  currentStep?: Step;
};

type PublishedMonacoEditorState = {};

var decorations: string[] = [];

export default class PublishedMonacoEditor extends Component<
  PublishedMonacoEditorProps,
  PublishedMonacoEditorState
> {
  private monacoInstance = createRef<editor.IStandaloneCodeEditor>();
  private monacoTypesWrapper!: typeof import("monaco-editor");

  constructor(props: PublishedMonacoEditorProps) {
    super(props);

    this.mountEditor = this.mountEditor.bind(this);
  }

  mountEditor(
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    (this.monacoInstance as React.MutableRefObject<
      editor.IStandaloneCodeEditor
    >).current = editor;

    this.monacoTypesWrapper = monaco;
    this.updateLines();
  }

  componentDidUpdate(prevProps: PublishedMonacoEditorProps) {
    let { currentStep } = this.props;
    // this.updateLines();

    // let animationOptions = {
    //   elementToScroll: this.monacoInstance!.getScrollerElement(),
    //   // add offset so scrolled to line isnt exactly at top
    //   verticalOffset: -50,
    // };
    // animateScrollTo(t, animationOptions);

    // this.monacoInstance.current?.setScrollPosition({ scrollTop: 100 });

    // let t = this.monacoInstance.current?.getTopForLineNumber(
    //   currentStep?.lines?.start!
    // ) as number;

    let t = this.monacoInstance.current?.getTopForPosition(
      currentStep?.lines?.start!,
      0
    ) as number;

    console.log(t);

    let className = "monaco-scrollable-element";
    // let className = 'overflow-guard';

    let animationOptions = {
      elementToScroll: document.getElementsByClassName(className)[0],
      // add offset so scrolled to line isnt exactly at top
      // verticalOffset: -50,
    };
    this.monacoInstance.current?.setScrollPosition(
      { scrollTop: 0 },
      this.monacoTypesWrapper.editor.ScrollType.Immediate
    );
    animateScrollTo(
      document.getElementsByClassName(" line-highlight")[0],
      animationOptions
    );
    // this.monacoInstance.current?.revealLine(
    //   currentStep?.lines?.start!,
    //   this.monacoTypesWrapper.editor.ScrollType.Smooth
    // );

    // this.monacoInstance.current?.setScrollPosition(
    //   { scrollTop: 50 },
    //   this.monacoTypesWrapper.editor.ScrollType.Smooth
    // );
  }

  updateLines() {
    console.log("update lines");
    let { currentStep } = this.props;
    let lines = currentStep?.lines;
    decorations = this.monacoInstance.current!.deltaDecorations(decorations, [
      {
        range: new this.monacoTypesWrapper.Range(
          lines?.start || 0,
          0,
          lines?.end || 0,
          0
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

  render() {
    // console.log(this.props.currentFile.language);
    let { language } = this.props.currentFile;
    let correctLanguage;
    if (language === "jsx") {
      correctLanguage = "javascript";
    }

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
        <MonacoEditor
          height={"100%"}
          language={correctLanguage}
          theme="monakai"
          value={this.props.currentFile.code}
          onChange={(value) => console.log(value)}
          options={{
            selectOnLineNumbers: true,
          }}
          editorDidMount={(editor, monaco) => {
            this.mountEditor(editor, monaco);
            //@ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
              if (label === "json") return "/_next/static/json.worker.js";
              if (label === "go") return "/_next/static/go.worker.js";
              if (label === "java") return "/_next/static/java.worker.js";
              if (label === "python") return "/_next/static/python.worker.js";
              if (label === "ruby") return "/_next/static/ruby.worker.js";
              if (label === "rust") return "/_next/static/rust.worker.js";
              if (label === "yaml") return "/_next/static/yaml.worker.js";
              if (label === "css") return "/_next/static/css.worker.js";
              if (label === "scss") return "/_next/static/scss.worker.js";
              if (label === "html") return "/_next/static/html.worker.js";
              if (label === "markdown")
                return "/_next/static/markdown.worker.js";
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
