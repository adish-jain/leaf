import React, { Component } from "react";
import "../styles/filebar.scss";

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
  );
}

function File(props: {
  name: string;
  index: number;
  selected: boolean;
  updateFile: (fileIndex: number) => void;
}) {
  let className = "published-file";
  if (props.selected) {
    className = "published-file-selected";
  }
  return (
    <div onClick={(e) => props.updateFile(props.index)} className={className}>
      {props.name}
    </div>
  );
}
