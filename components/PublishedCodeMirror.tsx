import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { Editor } from "draft-js";
import animateScrollTo from "animated-scroll-to";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/mode/go/go.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/php/php.js";
import "codemirror/mode/ruby/ruby.js";
import "codemirror/mode/textile/textile.js";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/python/python";

// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');
// require("codemirror/mode/jsx/jsx");

type CodeMirrorProps = {
  currentFile: File;
  currentStep?: StepType;
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

  componentDidUpdate(prevProps: CodeMirrorProps) {
    this.updateLines();
  }

  updateLines() {
    let { currentStep, currentFile } = this.props;

    // clear previous highlighted lines
    for (let i = 0; i < markers.length; i++) {
      markers[i].clear();
    }

    if (currentStep?.fileId !== currentFile.id) {
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
            mode: this.props.currentFile.language,
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
