import Prism, { highlight } from "prismjs";
import React, { Component, createRef } from "react";
import "../styles/prism.css";
import "../styles/prism-white.css";
import { File, Step } from "../typescript/types/app_types";

import "prismjs/plugins/line-highlight/prism-line-highlight.css";
import "prismjs/plugins/line-highlight/prism-line-highlight.min";

import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min";

import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
import "prismjs/components/prism-typescript.min";

import "../styles/prismeditor.scss";

import animateScrollTo from "animated-scroll-to";

type PrismEditorProps = {
  steps: Step[];
  currentStepIndex: number;
  files: File[];
  currentFileIndex: number;
};

type PrismEditorState = {
  startHighlightLine?: number;
  endHighlightLine?: number;
  hideLines: boolean;
  hovered: boolean;
};
let highlightedFiles: string[] = [];

export default class PrismEditor extends Component<
  PrismEditorProps,
  PrismEditorState
> {
  PrismWrapper = createRef<HTMLDivElement>();

  linesWrapper = createRef<HTMLDivElement>();

  constructor(props: PrismEditorProps) {
    super(props);

    this.updateLines = this.updateLines.bind(this);
    this.animateLines = this.animateLines.bind(this);
    this.renderFiles = this.renderFiles.bind(this);
    this.highlightedLines = this.highlightedLines.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.Line = this.Line.bind(this);

    this.syntaxHighlightFiles();

    this.state = {
      hideLines: false,
      hovered: false,
    };
  }

  syntaxHighlightFiles = () => {
    let { files } = this.props;
    for (let i = 0; i < files.length; i++) {
      let highlightedCode = Prism.highlight(
        files[i].code,
        Prism.languages.typescript,
        "typescript"
      );
      highlightedFiles.push(highlightedCode);
    }
  };

  componentDidUpdate(prevProps: PrismEditorProps) {
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;
    let currentFile = files[currentFileIndex];
    let currentStep = steps[currentStepIndex];
    let previousStep = steps[prevProps.currentStepIndex];
    let previousFile = files[prevProps.currentFileIndex];
    // if step changes
    if (previousStep.id !== currentStep?.id) {
      this.updateLines();
    }

    // file is deleted or added
    if (prevProps.files.length != files.length) {
      this.syntaxHighlightFiles();
      console.log("file length updated");
    }

    // if file changes
    if (currentFile.id !== currentFile.id) {
      // reset scroll position
      this.PrismWrapper.current!.scrollTop = 0;

      // if file is different from current step file, then hide the lines
      if (currentFile.id !== currentStep?.fileId) {
        this.setState({
          hideLines: true,
        });
      } else {
        this.setState({
          hideLines: false,
        });
      }
    }

    // Prism.highlightAll();
  }

  componentDidMount() {
    // Prism.highlightAll();
    console.log("CDM called");
    this.syntaxHighlightFiles();
    this.updateLines();
  }

  updateLines() {
    let { files, currentFileIndex } = this.props;
    let currentFile = files[currentFileIndex];
    let { steps, currentStepIndex } = this.props;
    let currentStep = steps[currentStepIndex];
    if (
      currentStep &&
      currentStep.lines !== null &&
      currentStep.lines !== undefined
    ) {
      this.setState(
        {
          startHighlightLine: currentStep.lines.start,
          endHighlightLine: currentStep.lines.end,
          hideLines: false,
        },
        () => {
          this.animateLines();
        }
      );
    }
  }

  animateLines() {
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;
    let currentStep = steps[currentStepIndex];

    let animationOptions = {
      elementToScroll: this.PrismWrapper.current!,
      // add offset so scrolled to line isnt exactly at top
      verticalOffset: -50,
    };

    let lineCalc = currentStep?.lines?.start! * 18;
    animateScrollTo(lineCalc, animationOptions);
  }

  renderFiles() {
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;
    let lineString = `${this.state.startHighlightLine}-${this.state.endHighlightLine}`;

    return (
      <div style={{ background: "white" }} ref={this.linesWrapper}>
        {files.map((file, index) => {
          let style = {
            display: "none",
            color: "black",
          };
          if (index === currentFileIndex) {
            style.display = "block";
          }
          return (
            <pre
              data-line={this.state.hideLines ? " " : lineString}
              className="line-numbers"
              style={style}
            >
              <code className="language-tsx">{file.code}</code>
              <this.highlightedLines />
              {/* <this.dimmer /> */}
            </pre>
          );
        })}
      </div>
    );
  }

  highlightedLines = () => {
    let { currentStepIndex, steps, currentFileIndex, files } = this.props;
    let currentStep = steps[currentStepIndex];
    let currentFile = files[currentFileIndex];
    if (currentFile.id !== currentStep.fileId) {
      return <div></div>;
    }

    let lines = currentStep.lines;
    if (lines == null) {
      return <div></div>;
    }
    let height = 1.5 * (Math.abs(lines.start - lines.end) + 1);
    let top = 1.5 * (lines.start - 1);
    let lineStyles = {
      height: `${height}em`,
      top: `${top}em`,
    };
    return <div style={lineStyles} className={"highlighted-lines"}></div>;
  };

  renderFile() {
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;
    let currentFile = files[currentFileIndex];
    let lines = highlightedFiles[currentFileIndex].split(/\r?\n/);
    return <this.CodeFile index={1} key={currentFile.id} lines={lines} />;
    // return (
    //   <div>
    //     {highlightedFiles.map((file, index) => {
    //       let lines = file.split(/\r?\n/);
    //       return <this.CodeFile key={index} index={index} lines={lines} />;
    //     })}
    //   </div>
    // );
  }

  CodeFile = (props: { lines: string[]; index: number }) => {
    let lines = props.lines;
    let index = props.index;
    let { hovered } = this.state;
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;
    let style = {
      background: "white",
      display: "block",
    };

    return (
      <div>
        <pre style={style} className="line-numbers">
          <code className="language-tsx">
            {lines.map((line, index) => (
              <this.Line
                steps={steps}
                currentStepIndex={currentStepIndex}
                key={`Line-${index}`}
                index={index}
                line={line}
                files={files}
                currentFileIndex={currentFileIndex}
                hovered={hovered}
              />
            ))}
          </code>
        </pre>
      </div>
    );
  };

  Line(LineProps: {
    index: number;
    line: string;
    steps: Step[];
    currentStepIndex: number;
    files: File[];
    currentFileIndex: number;
    hovered: boolean;
  }) {
    let {
      index,
      line,
      steps,
      currentStepIndex,
      files,
      currentFileIndex,
      hovered,
    } = LineProps;
    let currentStep = steps[currentStepIndex];
    let currentFile = files[currentFileIndex];
    let lines = currentStep.lines;
    let highlighted = "";
    let line_dim = "";
    let differentFile = currentFile.id !== currentStep.fileId;
    if (
      lines &&
      index >= lines.start - 1 &&
      index <= lines.end - 1 &&
      !differentFile
    ) {
      highlighted = "highlighted";
    } else if (!hovered && lines) {
      line_dim = "line-dim";
    }
    return (
      <div className={`line-wrapper ${highlighted} ${line_dim}`}>
        <span className={"line-number"}>{index}</span>
        <div
          className={"line-content"}
          dangerouslySetInnerHTML={injectHTML(line + "\n")}
        ></div>
      </div>
    );
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render() {
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;

    let currentStep = steps[currentStepIndex];
    let currentFile = files[currentFileIndex];
    let { language } = currentFile;

    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={this.PrismWrapper}
        className={"prism-editor"}
      >
        {/* <this.renderFiles /> */}
        <this.renderFile />
      </div>
    );
  }
}

function injectHTML(line: string) {
  return { __html: line };
}
