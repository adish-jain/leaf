import React, { Component, createRef } from "react";
import dynamic from "next/dynamic";
import PublishedLanguageBar from "./PublishedLanguageBar";
import PublishedFileBar from "./PublishedFileBar";
import "../styles/publishedcodeeditor.scss";
import { File, Step } from "../typescript/types/app_types";
import PrismEditor from "./PrismEditor";
import PublishedImageView from "./PublishedImageView";

type PublishedCodeEditorProps = {
  // changeStep: (newStep: number) => void;
  currentStepIndex: number;
  steps: Step[];
  files: File[];
  currentFileIndex: number;
  updateFile: (fileIndex: number) => void;
  scrollSpeed: number;
};

type PublishedCodeEditorState = {
  language: string;
};

export default class PublishedCodeEditor extends Component<
  PublishedCodeEditorProps,
  PublishedCodeEditorState
> {
  imageViewRef = createRef<HTMLDivElement>();
  // imageViewRef = createRef<HTMLImageElement>();

  constructor(props: PublishedCodeEditorProps) {
    super(props);

    this.state = {
      language: "jsx",
    };
  }

  render() {
    let {
      files,
      currentStepIndex,
      steps,
      updateFile,
      currentFileIndex,
      scrollSpeed
    } = this.props;
    let currentStep = steps[currentStepIndex];
    let currentFile = files[currentFileIndex];
    return (
      <div className={"editor-wrapper"}>
        <PublishedImageView
          steps={steps}
          currentStepIndex={currentStepIndex}
          imageViewRef={this.imageViewRef}
          scrollSpeed={scrollSpeed}
        />
        <PublishedFileBar
          updateFile={updateFile}
          files={files}
          currentFile={currentFile}
        />
        <PrismEditor
          steps={steps}
          currentStepIndex={currentStepIndex}
          files={files}
          currentFileIndex={currentFileIndex}
          imageViewRef={this.imageViewRef}
        />

        <PublishedLanguageBar language={currentFile.language} />
      </div>
    );
  }
}
