import React, { Component, createRef } from "react";
import PublishedLanguageBar from "./PublishedLanguageBar";
import PublishedFileBar from "./PublishedFileBar";
import "../styles/publishedcodeeditor.scss";
import { File, Step } from "../typescript/types/app_types";
import PrismEditor from "./PrismEditor";
import PublishedImageView from "./PublishedImageView";
import animateScrollTo from "animated-scroll-to";
import { SPEED_SCROLL_LIMIT } from "../components/FinishedPost";

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
  prismWrapper = createRef<HTMLDivElement>();
  // imageViewRef = createRef<HTMLImageElement>();

  constructor(props: PublishedCodeEditorProps) {
    super(props);

    this.state = {
      language: "jsx",
    };
  }

  animateLines = () => {
    let { steps, currentStepIndex, scrollSpeed } = this.props;
    let currentStep = steps[currentStepIndex];
    let animationOptions = {
      elementToScroll: this.prismWrapper.current!,
      // add offset so scrolled to line isnt exactly at top
      verticalOffset: -100,
    };
    // each line is around 18 pixels in height, and minus 5 to take into account some padding
    let lineCalc = currentStep?.lines?.start! * 18 - 5;
    if (scrollSpeed > SPEED_SCROLL_LIMIT) {
      this.prismWrapper.current!.scrollTop = lineCalc;
    } else {
      animateScrollTo(lineCalc, animationOptions);
    }
  };

  render() {
    let {
      files,
      currentStepIndex,
      steps,
      updateFile,
      currentFileIndex,
      scrollSpeed,
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
          prismWrapper={this.prismWrapper}
          animateLines={this.animateLines}
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
          prismWrapper={this.prismWrapper}
          animateLines={this.animateLines}
          key={currentFile.id}
        />

        <PublishedLanguageBar language={currentFile.language} />
      </div>
    );
  }
}
