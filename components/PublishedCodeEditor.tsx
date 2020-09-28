import React, { Component } from "react";
import dynamic from "next/dynamic";
import PublishedLanguageBar from "./PublishedLanguageBar";
import PublishedFileBar from "./PublishedFileBar";
import "../styles/publishedcodeeditor.scss";
import { File, Step } from "../typescript/types/app_types";
import PublishedMonacoEditor from "./PublishedMonacoEditor";
import PrismEditor from "./PrismEditor";
import PublishedImageView from "./PublishedImageView";

type PublishedCodeEditorProps = {
  // changeStep: (newStep: number) => void;
  currentStep: Step;
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
      <div className={"editor-wrapper"}>
        <PublishedImageView currentStep={currentStep} />
        <PublishedFileBar
          updateFile={updateFile}
          files={files}
          currentFile={currentFile}
        />
        <PrismEditor currentFile={currentFile} currentStep={currentStep} />
        <PublishedLanguageBar language={currentFile.language} />
      </div>
    );
  }
}
