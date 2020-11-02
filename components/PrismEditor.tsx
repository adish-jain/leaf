import Prism from "prismjs";
import React, { Component } from "react";
import "../styles/prism-white.css";
import { File, Step } from "../typescript/types/app_types";
import { getPrismLanguageFromBackend } from "../lib/utils/languageUtils";
const isBrowser = () => typeof window !== "undefined";

// prevents prism from highlighting immediately
if (isBrowser()) {
  window.Prism = window.Prism || {};
  //@ts-ignore
  Prism.manual = true;
}

//html, xml
import "prismjs/components/prism-markup.min";
// css, scss
import "prismjs/components/prism-css.min";
import "prismjs/components/prism-scss.min";
// yaml
import "prismjs/components/prism-yaml.min";
// json
import "prismjs/components/prism-json";
// typescript
import "prismjs/components/prism-typescript.min";
// tsx, jsx, javascript
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
// python
import "prismjs/components/prism-python.min";
// java
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-clike.min";
// go
import "prismjs/components/prism-go.min";
// php
import "prismjs/components/prism-php.min";
import "prismjs/components/prism-markup-templating.min";
// ruby
import "prismjs/components/prism-ruby.min";
// rust
import "prismjs/components/prism-rust.min";
// swift
import "prismjs/components/prism-swift.min";
// c
import "prismjs/components/prism-c.min";
// objectivec
import "prismjs/components/prism-objectivec";
// c++
import "prismjs/components/prism-cpp.min";
// textile/plaintext
import "prismjs/components/prism-textile.min";
// markdown
import "prismjs/components/prism-markdown.min";
// dockerfile
import "prismjs/components/prism-docker.min";

import "../styles/prismeditor.scss";

type PrismEditorProps = {
  steps: Step[];
  currentStepIndex: number;
  files: File[];
  currentFileIndex: number;
  imageViewRef: React.RefObject<HTMLDivElement>;
  prismWrapper: React.RefObject<HTMLDivElement>;
  animateLines: () => void;
};

type PrismEditorState = {
  hovered: boolean;
};

export default class PrismEditor extends Component<
  PrismEditorProps,
  PrismEditorState
> {
  highlightedFiles: string[] = [];

  constructor(props: PrismEditorProps) {
    super(props);

    //@ts-ignore
    // document.removeEventListener("DOMContentLoaded", Prism.highlightAll);

    this.updateLines = this.updateLines.bind(this);
    this.highlightedLines = this.highlightedLines.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.Line = this.Line.bind(this);
    this.syntaxHighlightFiles();
    // highlightedFiles = ["test", "Test", "Test"];
    this.state = {
      hovered: false,
    };
  }
  /*
  uses prism to create syntax higlighted code
  run once on mount and everytime a new file is added or removed.
  */
  syntaxHighlightFiles = () => {
    let { files } = this.props;
    for (let i = 0; i < files.length; i++) {
      let prismLanguage = getPrismLanguageFromBackend(files[i].language);
      let highlightedCode = Prism.highlight(
        files[i].code,
        Prism.languages[prismLanguage],
        files[i].language
      );
      this.highlightedFiles.push(highlightedCode);
    }
  };

  componentDidUpdate(prevProps: PrismEditorProps) {
    let {
      steps,
      currentStepIndex,
      files,
      currentFileIndex,
      prismWrapper,
    } = this.props;
    let currentFile = files[currentFileIndex];
    let currentStep = steps[currentStepIndex];
    let previousStep = steps[prevProps.currentStepIndex];
    let previousFile = files[prevProps.currentFileIndex];
    // if step changes
    if (previousStep?.id !== currentStep?.id) {
      this.updateLines();
    }

    // file is deleted or added
    if (prevProps.files.length != files.length) {
      this.syntaxHighlightFiles();
    }

    // if file changes
    if (currentFile.id !== currentFile.id) {
      // reset scroll position
      prismWrapper.current!.scrollTop = 0;
    }
  }

  componentDidMount() {
    this.syntaxHighlightFiles();
    this.updateLines();
  }

  updateLines() {
    let {
      files,
      currentFileIndex,
      animateLines,
      steps,
      currentStepIndex,
    } = this.props;
    let currentFile = files[currentFileIndex];
    let currentStep = steps[currentStepIndex];
    if (
      currentStep &&
      currentStep.lines !== null &&
      currentStep.lines !== undefined
    ) {
      animateLines();
    }
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
    let lines = this.highlightedFiles[currentFileIndex].split(/\r?\n/);
    return <this.CodeFile key={currentFile.id} lines={lines} />;
  }

  CodeFile = (props: { lines: string[] }) => {
    let lines = props.lines;
    let { hovered } = this.state;
    let { steps, currentStepIndex, files, currentFileIndex } = this.props;
    let currentFile = files[currentFileIndex];
    let language = currentFile.language;
    let style = {
      background: "white",
      display: "block",
    };

    return (
      <div>
        <pre style={style} className="line-numbers">
          <code className={`language-${language}`}>
            {lines.map((line, index) => (
              <this.Line
                steps={steps}
                currentStepIndex={currentStepIndex}
                key={`Line-${index} ${currentFile.id}`}
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
    let lines = currentStep?.lines;
    let highlighted = "";
    let line_dim = "";
    let differentFile = currentFile?.id !== currentStep?.fileId;

    // highlight selected lines and dim unselected lines
    // undim all lines upon hover
    if (
      lines &&
      index >= lines.start - 1 &&
      index <= lines.end - 1 &&
      !differentFile
    ) {
      highlighted = "highlighted";
    } else if (!hovered && lines && !differentFile) {
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
    let {
      steps,
      currentStepIndex,
      files,
      currentFileIndex,
      prismWrapper,
    } = this.props;

    let currentStep = steps[currentStepIndex];
    let currentFile = files[currentFileIndex];
    let { language } = currentFile;

    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={prismWrapper}
        className={"prism-editor"}
      >
        <this.renderFile key={currentFile.id} />
      </div>
    );
  }
}

function injectHTML(line: string) {
  return { __html: line };
}
