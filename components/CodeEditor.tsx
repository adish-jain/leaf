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
  saveCode: (code: string) => void;
  saveLanguage: (language: string) => void;
  draftCode: string;
  language: string;
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
      language: this.props.language,
    };

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  handleLanguageChange (language: string) {
    this.setState({
      language: language,
    });
    this.props.saveLanguage(language);
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
        {// @ts-ignore 
          <DynamicCodeEditor highlightLines={this.props.highlightLines} 
          language={this.state.language}
          saveCode={this.props.saveCode} 
          draftCode={this.props.draftCode}/>
        }
        <LanguageBar 
          language={this.state.language} 
          handleLanguageChange={this.handleLanguageChange}/>
      </div>
    );
  }
}