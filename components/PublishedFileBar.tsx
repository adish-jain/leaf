import React, { Component } from "react";
import "../styles/filebar.scss";
import "../styles/filenames.scss";

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type PublishedFileBarProps = {
  files: File[];
  updateFile: (fileIndex: number) => void;
  currentFile: File;
};

export default function PublishedFileBar(props: PublishedFileBarProps) {
  return (
    <div className={"published-filebar"}>
      <div className={"title-with-divider"}>
        <label>files</label>
        <div></div>
      </div>
      <div className={"files"}>
        {props.files.map((file, index) => (
          <File
            key={file.id}
            index={index}
            name={file.name}
            updateFile={props.updateFile}
            selected={file.name === props.currentFile.name}
          />
        ))}
      </div>
    </div>
  );
}

function File(props: {
  name: string;
  index: number;
  selected: boolean;
  updateFile: (fileIndex: number) => void;
}) {
  let wrapperClass;
  props.selected
    ? (wrapperClass = "filename-wrapper-selected")
    : (wrapperClass = "filename-wrapper");

  return (
    <div
      onClick={(e) => props.updateFile(props.index)}
      className={wrapperClass}
    >
      {props.name}
    </div>
  );
}
