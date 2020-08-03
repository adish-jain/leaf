import React, { Component } from "react";
import dynamic from "next/dynamic";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import CodeEditorStyles from "../styles/CodeEditor.module.scss";

// import CodeMirror from './DynamicComponent';
// const {CodeMirror} = require('./DynamicComponent');

const DynamicCodeEditor = dynamic(
  (() => import("./DynamicCodeEditor")) as any,
  {
    ssr: false,
  }
);

type File = {
  id: string;
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type Line = {
  lineNumber: number;
  char: number;
};

type CodeEditorProps = {
  draftId: string;
  saveFileCode: (fileName: string) => void;
  editingStep: number;
  changeFileLanguage: (language: string, external: boolean) => void;
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  draftCode: string;
  changeLines: (lines: { start: Line; end: Line }) => void;
  saveLines: (fileName: string, remove: boolean) => void;
  // filenames map to language
  files: File[];
  addFile: () => void;
  removeFile: (toDeleteIndex: number) => void;
  selectedFileIndex: number;
  changeCode: (value: string) => void;
  changeSelectedFile: (fileIndex: number) => void;
  language: string;
  lines: { start: Line; end: Line };
};

type CodeEditorState = {};

export default class CodeEditor extends Component<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);
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
    } = this.props;
    return (
      <div className={CodeEditorStyles["CodeEditor"]}>
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
        <DynamicCodeEditor
          // @ts-ignore
          saveFileCode={saveFileCode}
          draftCode={draftCode}
          changeCode={changeCode}
          language={language}
          editing={editingStep !== -1}
          changeLines={changeLines}
          saveLines={saveLines}
          lines={lines}
          selectedFile={files[selectedFileIndex]}
        />
        <LanguageBar
          language={language}
          changeFileLanguage={changeFileLanguage}
        />
      </div>
    );
  }
}
