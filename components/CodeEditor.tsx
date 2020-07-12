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
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type CodeEditorProps = {
  highlightLines: (start: any, end: any) => void;
  saveCode: () => void;
  handleLanguageChange: (language: string) => void;
  draftCode: string;

  // filenames map to language
  files: File[];
  addFile: () => void;
  deleteFile: (toDeleteIndex: number) => void;
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
      saveCode,
      draftCode,
      files,
      changeCode,
      addFile,
      deleteFile,
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
          files={files}
          addFile={addFile}
          deleteFile={deleteFile}
          selectedFileIndex={selectedFileIndex}
          changeSelectedFile={changeSelectedFile}
        />
        <DynamicCodeEditor
          // @ts-ignore
          highlightLines={this.props.highlightLines}
          saveCode={saveCode}
          draftCode={draftCode}
          changeCode={changeCode}
          language={language}
        />
        <LanguageBar
          language={this.props.language}
          handleLanguageChange={this.props.handleLanguageChange}
        />
      </div>
    );
  }
}
