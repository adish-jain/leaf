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
  //replace with enum
  language: string;
  code: string;
};

type CodeEditorProps = {
  highlightLines: (start: any, end: any) => void;
  saveCode: (code: string) => void;
  draftCode: string;

  // filenames map to language
  files: { [key: string]: File };
  addFile: (fileName: string) => void;
  deleteFile: (fileName: string) => void;
  changeSelectedFile: (fileName: string) => void;
  selectedFile: string;
  changeCode: (value: string) => void;
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
    let { saveCode, draftCode, files, changeCode } = this.props;
    let { language } = this.state;
    return (
      <div>
        <style jsx>{`
          box-shadow: 0px 4px 16px #edece9;
          border-radius: 8px;
        `}</style>
        <FileBar files={files} />
        {
          <DynamicCodeEditor
            // @ts-ignore
            highlightLines={this.props.highlightLines}
            saveCode={saveCode}
            draftCode={draftCode}
            key={draftCode.length}
            changeCode={changeCode}
          />
        }
        <LanguageBar language={language} />
      </div>
    );
  }
}
