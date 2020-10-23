import Prism from "prismjs";
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
};

export default class PrismEditor extends Component<
  PrismEditorProps,
  PrismEditorState
> {
  PrismWrapper = createRef<HTMLDivElement>();

  constructor(props: PrismEditorProps) {
    super(props);

    this.updateLines = this.updateLines.bind(this);
    this.animateLines = this.animateLines.bind(this);
    this.renderFiles = this.renderFiles.bind(this);

    this.state = {
      hideLines: false,
    };
  }

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
    Prism.highlightAll();
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
      <div>
        {files.map((file, index) => {
          let style = {
            display: "none",
          };
          if (index === currentFileIndex) {
            style = {
              display: "block",
            };
          }
          return (
            <pre
              data-line={this.state.hideLines ? " " : lineString}
              className="line-numbers"
              style={style}
            >
              <code className="language-tsx">{file.code}</code>
            </pre>
          );
        })}
      </div>
    );
  }

  render() {
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;

    let currentStep = steps[currentStepIndex];
    let currentFile = files[currentFileIndex];
    let { language } = currentFile;

    return (
      <div className={"prism-editor"} ref={this.PrismWrapper}>
        <this.renderFiles />
      </div>
    );
  }
}
