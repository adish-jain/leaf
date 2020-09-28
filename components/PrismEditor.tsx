import Prism from "prismjs";
import React, { Component, createRef } from "react";
// import "../styles/prism.css";
import "../styles/prism-white.css";
import { File, Step } from "../typescript/types/app_types";

import "prismjs/plugins/line-highlight/prism-line-highlight.css";
import "prismjs/plugins/line-highlight/prism-line-highlight.min";

import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min";

import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
import "prismjs/components/prism-typescript.min";

import animateScrollTo from "animated-scroll-to";

type PrismEditorProps = {
  currentFile: File;
  currentStep?: Step;
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

    this.state = {
      hideLines: false,
    };
  }

  componentDidUpdate(prevProps: PrismEditorProps) {
    // if step changes
    if (prevProps.currentStep?.id !== this.props.currentStep?.id) {
      this.updateLines();
    }

    // if file changes
    if (prevProps.currentFile.id !== this.props.currentFile.id) {
      // reset scroll position
      this.PrismWrapper.current!.scrollTop = 0;

      // if file is different from current step file, then hide the lines
      if (this.props.currentFile.id !== this.props.currentStep?.fileId) {
        this.setState({
          hideLines: true,
        });
      } else {
        this.setState({
          hideLines: false,
        });
      }
    }

    Prism.highlightAll();
  }

  componentDidMount() {
    Prism.highlightAll();
    this.updateLines();
  }

  updateLines() {
    let { currentStep, currentFile } = this.props;
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
    let { currentStep, currentFile } = this.props;

    let animationOptions = {
      elementToScroll: this.PrismWrapper.current!,
      // add offset so scrolled to line isnt exactly at top
      verticalOffset: -50,
    };

    let lineCalc = currentStep?.lines?.start! * 18;
    animateScrollTo(lineCalc, animationOptions);
  }

  render() {
    let { language } = this.props.currentFile;

    let lineString = `${this.state.startHighlightLine}-${this.state.endHighlightLine}`;

    return (
      <div ref={this.PrismWrapper}>
        <style jsx>{`
          flex-grow: 100;
          overflow-y: scroll;
          position: relative;
          // height: 0px;
        `}</style>
        <pre
          data-line={this.state.hideLines ? " " : lineString}
          className="line-numbers"
        >
          <code className="language-tsx">{this.props.currentFile.code}</code>
        </pre>
      </div>
    );
  }
}
