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

type PublishedCodeEditorProps = {
  // changeStep: (newStep: number) => void;
  currentStep: number;
  files: File[];
  currentFile: File;
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
    let { files, currentFile, currentStep } = this.props;
    return (
      <div className={PublishedCodeEditorStyles["editor-wrapper"]}>
        <PublishedFileBar files={files}/>
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
