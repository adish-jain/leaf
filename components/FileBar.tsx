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
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  addFile: () => void;
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
      saveFileName,
      onNameChange,
      addFile,
      removeFile,
      selectedFileIndex,
    } = this.props;

    return (
      <div className={fileBarStyles.FileBar}>
        {files.map((file, index) => (
          <FileName
            name={file.name}
            key={file.id}
            changeSelectedFile={changeSelectedFile}
            saveFileName={saveFileName}
            onNameChange={onNameChange}
            selected={selectedFileIndex === index}
            removeFile={removeFile}
            index={index}
          />
        ))}
        <button  className={fileBarStyles['add-new-file-btn']} onClick={e => addFile()}>Add New file</button>
      </div>
    );
  }
}
