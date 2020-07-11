import React, { Component } from "react";
import dynamic from "next/dynamic";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import PreviewSection from "./PreviewSection";

// import CodeMirror from './DynamicComponent';
// const {CodeMirror} = require('./DynamicComponent');

const DynamicCodeEditor = dynamic((() => import("./DynamicCodeEditor")) as any, {
  ssr: false,
});

type CodeEditorProps = {
  highlightLines: (start: any, end: any) => void;
  saveCode: () => void;
  handleCodeChange: (code: string) => void;
  handleLanguageChange: (language: string) => void;
  draftCode: string;
  language: string;
};

type CodeEditorState = {
};

export default class CodeEditor extends Component<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <style jsx>{`
          box-shadow: 0px 4px 16px #edece9;
          border-radius: 8px;
        `}</style>
        <PreviewSection />
        <FileBar />
        {
          <DynamicCodeEditor // @ts-ignore 
            highlightLines={this.props.highlightLines} 
            language={this.props.language}
            saveCode={this.props.saveCode}
            handleCodeChange={this.props.handleCodeChange} 
            draftCode={this.props.draftCode}/>
        }
        <LanguageBar 
          language={this.props.language} 
          handleLanguageChange={this.props.handleLanguageChange}/>
      </div>
    );
  }
}