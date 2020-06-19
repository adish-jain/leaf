import React, { Component } from "react";
import  FileName from "./FileName";
const fileNamesStyle = require('../styles/FileNames.module.scss');

type FileNamesProps = {
  selectedFile: number;
  files: string[];
  changeSelected: (selected_file: number) => void;
};

export default function FileNames(props: FileNamesProps) {
  function renderFile(filename: string, index: number) {
    let selected: boolean = false;

    if (props.selectedFile === index) {
      selected = true;
    }

    return (
      <FileName
        changeSelected={props.changeSelected}
        selected={selected}
        key={index}
        index={index}
      >
        {filename}
      </FileName>
    );
  }

  return (
    <div className={fileNamesStyle.filenames}>
      {props.files.map((filename, index) => renderFile(filename, index))}
    </div>
  );
}
