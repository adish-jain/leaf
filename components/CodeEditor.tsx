import React, { Component } from "react";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import ImageOptions from "./ImageOptions";
import "../styles/codeeditor.scss";
import MonacoEditor from "./MonacoEditor";
import ImageView from "./ImageView";
import { File, Step as StepType, Lines } from "../typescript/types/app_types";
import { FilesContext } from "../contexts/files-context";
import { fileObject } from "../typescript/types/frontend/postTypes";
import { DraftContext } from "../contexts/draft-context";

type CodeEditorProps = {};

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
    let {} = this.props;

    return (
      <div className={"CodeEditor"}>
        <ImageView />
        <FileBar />
        <DraftContext.Consumer>
          {({ currentlyEditingBlock }) => (
            <FilesContext.Consumer>
              {({
                selectedFile,
                currentlySelectedLines,
                changeSelectedLines,
                saveFileCode,
                changeCode
              }) => (
                <MonacoEditor
                  draftCode={selectedFile?.code || ""}
                  currentlySelectedLines={currentlySelectedLines}
                  selectedFile={selectedFile}
                  currentlyEditingBlock={currentlyEditingBlock}
                  changeSelectedLines={changeSelectedLines}
                  saveFileCode={saveFileCode}
                  changeCode={changeCode}
                />
              )}
            </FilesContext.Consumer>
          )}
        </DraftContext.Consumer>
        <LanguageBar />
      </div>
    );
  }
}
