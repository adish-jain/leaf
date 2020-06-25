import React, { Component } from "react";
import dynamic from "next/dynamic";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import PreviewSection from "./PreviewSection";

// import CodeMirror from './DynamicComponent';
// const {CodeMirror} = require('./DynamicComponent');

const DynamicCodeEditor = dynamic(
  (() => import("./DynamicCodeEditor")) as any,
  {
    ssr: false,
  }
);

type CodeEditorProps = {
  // changeStep: (newStep: number) => void;
  currentStep: number;
};

type CodeEditorState = {
  language: string;
};

export default class CodeEditor extends Component<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {
      language: "jsx",
    };
  }

  render() {
    return (
      <div>
        <style jsx>{`
          box-shadow: 0px 4px 16px #edece9;
          border-radius: 8px;
          position: sticky;
          top: 2vh;
          height: 96vh;
          margin-top: 2vhpx;
          margin-bottom: 2vh;
        `}</style>
        <FileBar />
        {
          //@ts-ignore
          <DynamicCodeEditor currentStep={this.props.currentStep} />
        }
        <LanguageBar language={this.state.language} />
      </div>
    );
  }
}
