import { monaco } from "@monaco-editor/react";
// import { ControlledEditor } from "@monaco-editor/react";
import { Component } from "react";
import { File, Step } from "../typescript/types/app_types";
import dynamic from "next/dynamic";
const ControlledEditor = dynamic(
  () =>
    import("@monaco-editor/react").then((mod) => mod.ControlledEditor) as any,
  {
    ssr: false,
  }
);

type Line = {
  lineNumber: number;
  char: number;
};

type MonacoEditorState = {};

type MonacoEditorProps = {
  // highlightLines: (start: any, end: any) => void;
  saveFileCode: (fileName: string) => void;
  draftCode: string;
  changeCode: (value: string) => void;
  changeLines: (lines: { start: Line; end: Line }) => void;
  saveLines: (fileName: string, remove: boolean) => void;
  language: string;
  editing: boolean;
  lines: {
    start: Line;
    end: Line;
  };
  selectedFile: File;
};

export default class MonacoEditor extends Component<
  MonacoEditorProps,
  MonacoEditorState
> {
  constructor(props: MonacoEditorProps) {
    super(props);

    this.state = {};
  }

  handleChange(event, value: string) {
    console.log(event);
  }

  render() {
    let { draftCode, language } = this.props;

    return <ControlledEditor onChange={this.handleChange} />;
  }
}
