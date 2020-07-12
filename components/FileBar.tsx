import React, { Component } from "react";
import FileName from "./FileName";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type FileBarProps = {
  files: File[];
  changeSelectedFile: (fileIndex: number) => void;
  addFile: () => void;
  deleteFile: (toDeleteIndex: number) => void;
  selectedFileIndex: number;
};

export default class FileBar extends Component<FileBarProps> {
  constructor(props: FileBarProps) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      files,
      changeSelectedFile,
      addFile,
      deleteFile,
      selectedFileIndex,
    } = this.props;

    return (
      <div className={fileBarStyles.FileBar}>
        {files.map((file, index) => (
          <FileName
            name={file.name}
            key={file.name}
            changeSelectedFile={changeSelectedFile}
            selected={selectedFileIndex === index}
            deleteFile={deleteFile}
            index={index}
          />
        ))}
        <button onClick={addFile}>+</button>
      </div>
    );
  }
}
