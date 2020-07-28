import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { Editor } from "draft-js";

// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');
require("codemirror/mode/jsx/jsx");

type CodeMirrorProps = {
  currentStep: StepType;
  currentFile: File;
};

type StepType = {
  text: string;
  id: string;
  fileName: string;
  lines: { start: number; end: number };
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

    this.instance = undefined;
  }

  componentDidUpdate(prevProps: CodeMirrorProps) {
    let { currentStep } = this.props;
    for (let i = 0; i < markers.length; i++) {
      markers[i].clear();
    }
    if (currentStep.lines !== null && currentStep.lines !== undefined) {
      let newMarker = this.instance?.markText(
        { line: currentStep.lines.start, ch: 0 },
        { line: currentStep.lines.end, ch: 5 },
        {
          className: "MarkText",
        }
      );
      markers.push(newMarker!);

      // get top position of selected line and scroll to it
      let t = this.instance!.charCoords(
        { line: currentStep.lines.start, ch: 0 },
        "local"
      ).top;
      let middleHeight = this.instance!.getScrollerElement().offsetHeight / 2;
      this.instance?.scrollTo(null, t - middleHeight - 5);
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
          height: auto;
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
            y: 0,
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({
              value,
            });
          }}
        />
      </div>
    );
  }
}
