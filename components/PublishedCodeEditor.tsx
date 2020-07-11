import React, { Component } from "react";
import dynamic from "next/dynamic";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import PreviewSection from "./PreviewSection";

// import CodeMirror from './DynamicComponent';
// const {CodeMirror} = require('./DynamicComponent');

const PublishedCodeMirror = dynamic(
  (() => import("./PublishedCodeMirror")) as any,
  {
    ssr: false,
  }
);

type PublishedCodeEditorProps = {
  // changeStep: (newStep: number) => void;
  currentStep: number;
};

type PublishedCodeEditorState = {
  language: string;
};

export default class PublishedCodeEditor extends Component<
  PublishedCodeEditorProps,
  PublishedCodeEditorState
> {
  constructor(props: PublishedCodeEditorProps) {
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
          <PublishedCodeMirror currentStep={this.props.currentStep} />
        }
      </div>
    );
  }
}
