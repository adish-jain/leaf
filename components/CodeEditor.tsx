import React, { Component } from "react";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import ImageOptions from "./ImageOptions";
import codeEditorStyles from "../styles/codeeditor.module.scss";
import MonacoEditor from "./MonacoEditor";
import ImageView from "./ImageView";
import { File, Step as StepType, Lines } from "../typescript/types/app_types";
import { FilesContext } from "../contexts/files-context";
import { fileObject } from "../typescript/types/frontend/postTypes";
import { DraftContext } from "../contexts/draft-context";
import { Dispatch, SetStateAction } from "react";
import SlatePrismEditor from "./SlatePrismEditor";

type CodeEditorProps = {
  currentlySelectedLines: Lines;
  changeSelectedLines: Dispatch<SetStateAction<Lines>>;
};

type CodeEditorState = {};

export default function CodeEditor(props: CodeEditorProps) {
  const { currentlySelectedLines, changeSelectedLines } = props;
  console.log("rerender code editor");
  return (
    <div className={codeEditorStyles["CodeEditor"]}>
      <ImageView />
      <FileBar />
      <SlatePrismEditor />
      <LanguageBar />
    </div>
  );
}
