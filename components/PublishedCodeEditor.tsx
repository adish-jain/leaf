import React, { Component } from "react";
import dynamic from "next/dynamic";
import PublishedLanguageBar from "./PublishedLanguageBar";
import PublishedFileBar from "./PublishedFileBar";
import PublishedCodeEditorStyles from "../styles/PublishedCodeEditor.module.scss";

// import CodeMirror from './DynamicComponent';
// const {CodeMirror} = require('./DynamicComponent');

const PublishedCodeMirror = dynamic(
  (() => import("./PublishedCodeMirror")) as any,
  {
    ssr: false,
  }
);

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type StepType = {
  text: string;
  id: string;
  fileName: string;
  lines: { start: number; end: number };
};

type PublishedCodeEditorProps = {
  // changeStep: (newStep: number) => void;
  currentStep: StepType;
  files: File[];
  currentFile: File;
  updateFile: (fileIndex: number) => void;
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
    let { files, currentFile, currentStep, updateFile } = this.props;
    return (
      <div className={PublishedCodeEditorStyles["editor-wrapper"]}>
        <PublishedFileBar updateFile={updateFile} files={files} />
        {
          <PublishedCodeMirror
            //@ts-ignore
            currentFile={currentFile}
            currentStep={currentStep}
          />
        }
        <PublishedLanguageBar language={currentFile.language} />
      </div>
    );
  }
}
