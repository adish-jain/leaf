import React, { Component } from "react";
import FileName from "./FileName";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  //replace with enum
  language: string;
  code: string;
};

type FileBarProps = {
  files: { [key: string]: File };
  changeSelectedFile: (fileName: string) => void;
  addFile: () => void;
};

export default class FileBar extends Component<FileBarProps> {
  constructor(props: FileBarProps) {
    super(props);
    this.state = {};
  }

  render() {
    let { files, changeSelectedFile, addFile } = this.props;
    let fileArray: {
      name: string;
      code: string;
      language: string;
    }[] = [];
    Object.keys(files).forEach(function (key) {
      var value = files[key];
      fileArray.push({
        ...{ name: key },
        ...value,
      });
    });
    return (
      <div className={fileBarStyles.FileBar}>
        {fileArray.map((file) => (
          <FileName
            name={file.name}
            key={file.name}
            changeSelected={changeSelectedFile}
            selected={true}
          />
        ))}
        <button onClick={addFile}>+</button>
      </div>
    );
  }
}
