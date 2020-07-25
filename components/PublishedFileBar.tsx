import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type PublishedFileBarProps = {
  files: File[];
  updateFile: (fileIndex: number) => void;
};

export default function PublishedFileBar(props: PublishedFileBarProps) {
  return (
    <div className={fileBarStyles["published-filebar"]}>
      {props.files.map((file, index) => (
        <File
          key={file.id}
          index={index}
          name={file.name}
          updateFile={props.updateFile}
        />
      ))}
    </div>
  );
}

function File(props: {
  name: string;
  index: number;
  updateFile: (fileIndex: number) => void;
}) {
  return (
    <div
      onClick={(e) => props.updateFile(props.index)}
      className={fileBarStyles["published-file"]}
    >
      {props.name}
    </div>
  );
}
