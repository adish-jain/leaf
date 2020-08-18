import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { Editor } from "draft-js";
import animateScrollTo from "animated-scroll-to";

// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');
require("codemirror/mode/jsx/jsx");

type CodeMirrorProps = {
  currentStep: StepType;
  currentFile: File;
  lines: Lines;
};

type Lines = {
  start: number;
  end: number;
};

type StepType = {
  text: string;
  id: string;
  fileId: string;
  lines: Lines;
};

type CodeMirrorState = {};

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

const ranges = [
  {
    anchor: { ch: 0, line: 0 },
    head: { ch: 0, line: 1 },
  },
  {
    anchor: { ch: 0, line: 1 },
    head: { ch: 0, line: 2 },
  },
];

const rangetest = {};
var markers: CodeMirror.TextMarker[] = [];

export default class PublishedCodeMirror extends Component<
  CodeMirrorProps,
  CodeMirrorState
> {
  instance: CodeMirror.Editor | undefined;

  constructor(props: CodeMirrorProps) {
    super(props);
    this.updateLines = this.updateLines.bind(this);

    this.instance = undefined;
  }

  componentDidMount() {
    this.updateLines();
  }

  getSnapshotBeforeUpdate(
    prevProps: CodeMirrorProps,
    prevState: CodeMirrorState
  ) {
    this.updateLines();
    return null;
  }

  componentDidUpdate(prevProps: CodeMirrorProps) {
    // this.updateLines();
  }

  updateLines() {
    let { currentStep, currentFile } = this.props;

    // clear previous highlighted lines
    for (let i = 0; i < markers.length; i++) {
      markers[i].clear();
    }

    if (currentStep.fileId !== currentFile.id) {
      return;
    }

    // mark new lines
    if (
      currentStep &&
      currentStep.lines !== null &&
      currentStep.lines !== undefined
    ) {
      let newMarker = this.instance?.markText(
        { line: currentStep.lines.start - 1, ch: 0 },
        { line: currentStep.lines.end - 1, ch: 80 },
        {
          className: "MarkText",
        }
      );
      markers.push(newMarker!);

      // get top position of selected line and scroll to it
      let t = this.instance!.charCoords(
        { line: currentStep.lines.start - 1, ch: 0 },
        "local"
      ).top;

      let animationOptions = {
        elementToScroll: this.instance!.getScrollerElement(),
        // add offset so scrolled to line isnt exactly at top
        verticalOffset: -50,
      };
      animateScrollTo(t, animationOptions);
    }
  }

  render() {
    return (
      <div>
        <style jsx>{`
          flex-grow: 100;
          overflow-y: scroll;
          position: relative;
          background-color: #263238;
          font-size: 12px;
          height: 0px;
        `}</style>
        <CodeMirror2
          className={"CodeEditor"}
          value={this.props.currentFile.code}
          options={{
            lineNumbers: true,
            mode: "jsx",
            theme: "monokai-sublime",
            lineWrapping: true,
          }}
          onSelection={(editor, data) => {}}
          editorDidMount={(editor) => {
            this.instance = editor;
            editor.setSize("100%", "100%");
          }}
          scroll={{
            // y: 0,
          }}
          onBeforeChange={(editor, data, value) => {}}
        />
      </div>
    );
  }
}
