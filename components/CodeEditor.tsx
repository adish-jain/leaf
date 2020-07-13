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

type File = {
  id: string;
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type CodeEditorProps = {
  draftId: string;
  highlightLines: (start: any, end: any) => void;
  saveFileCode: () => void;
  changeFileLanguage: (language: string) => void;
  draftCode: string;

  // filenames map to language
  files: File[];
  addFile: (draftId: string) => void;
  removeFile: (toDeleteIndex: number) => void;
  selectedFileIndex: number;
  changeCode: (value: string) => void;
  changeSelectedFile: (fileIndex: number) => void;
  language: string;
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
      language,
    } = this.props;
    return (
      <div>
        <style jsx>{`
          box-shadow: 0px 4px 16px #edece9;
          border-radius: 8px;
        `}</style>
        <FileBar
          draftId={draftId}
          files={files}
          addFile={addFile}
          removeFile={removeFile}
          selectedFileIndex={selectedFileIndex}
          changeSelectedFile={changeSelectedFile}
        />
        <DynamicCodeEditor
          // @ts-ignore
          highlightLines={this.props.highlightLines}
          saveFileCode={saveFileCode}
          draftCode={draftCode}
          changeCode={changeCode}
          language={language}
        />
        <LanguageBar
          language={language}
          changeFileLanguage={this.props.changeFileLanguage}
        />
      </div>
    );
  }
}
