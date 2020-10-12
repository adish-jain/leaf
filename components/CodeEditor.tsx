import React, { Component } from "react";
import dynamic from "next/dynamic";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import ImageOptions from "./ImageOptions";
import "../styles/codeeditor.scss";
import MonacoEditor from "./MonacoEditor";
import ImageView from "./ImageView";
import { File, Step as StepType, Lines } from "../typescript/types/app_types";

type CodeEditorProps = {
  draftId: string;
  saveFileCode: () => void;
  editingStep: number;
  changeFileLanguage: (language: string, external: boolean) => void;
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  draftCode: string;
  changeLines: (lines: Lines) => void;
  saveLines: (fileName: string, remove: boolean) => void;
  // filenames map to language
  files: File[];
  addFile: () => void;
  removeFile: (toDeleteIndex: number) => void;
  selectedFileIndex: number;
  changeCode: (value: string) => void;
  changeSelectedFile: (fileIndex: number) => void;
  language: string;
  lines: Lines;
  // whether or the draft page should display the block side
  shouldShowBlock: boolean;
  currentlyEditingStep: StepType;
  deleteStepImage: (stepId: string) => void;
  addStepImage: (selectedImage: any, stepId: string) => void;
};

type CodeEditorState = {};

export default class CodeEditor extends Component<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {
      // everytime we need to remount the monaco editor for resizing, we increment this key
      monacoKey: 0,
    };

  }

  render() {
    let {
      draftId,
      saveFileCode,
      draftCode,
      files,
      changeCode,
      addFile,
      removeFile,
      selectedFileIndex,
      changeSelectedFile,
      changeFileLanguage,
      saveFileName,
      onNameChange,
      language,
      editingStep,
      changeLines,
      saveLines,
      lines,
      shouldShowBlock,
      currentlyEditingStep,
      addStepImage,
      deleteStepImage,
    } = this.props;

    return (
      <div className={"CodeEditor"}>
        <ImageView
          addStepImage={addStepImage}
          currentlyEditingStep={currentlyEditingStep}
          deleteStepImage={deleteStepImage}
        />
        <FileBar
          draftId={draftId}
          files={files}
          addFile={addFile}
          removeFile={removeFile}
          selectedFileIndex={selectedFileIndex}
          changeSelectedFile={changeSelectedFile}
          saveFileName={saveFileName}
          onNameChange={onNameChange}
        />
        <MonacoEditor
          saveFileCode={saveFileCode}
          draftCode={draftCode}
          changeCode={changeCode}
          language={language}
          editing={editingStep !== -1}
          changeLines={changeLines}
          saveLines={saveLines}
          lines={lines}
          selectedFile={files[selectedFileIndex]}
          currentlyEditingStep={currentlyEditingStep}
        />
        <LanguageBar
          language={language}
          changeFileLanguage={changeFileLanguage}
        />
      </div>
    );
  }
}
