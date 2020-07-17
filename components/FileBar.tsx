import React, { Component } from "react";
import FileName from "./FileName";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  id: string;
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type FileBarProps = {
  draftId: string;
  files: File[];
  changeSelectedFile: (fileIndex: number) => void;
  addFile: (draftId: string) => void;
  removeFile: (toDeleteIndex: number) => void;
  selectedFileIndex: number;
};

export default class FileBar extends Component<FileBarProps> {
  constructor(props: FileBarProps) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      draftId,
      files,
      changeSelectedFile,
      addFile,
      removeFile,
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
            removeFile={removeFile}
            index={index}
          />
        ))}
        <button onClick={e => addFile(draftId)}>+</button>
      </div>
    );
  }
}
