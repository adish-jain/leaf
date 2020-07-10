import React, { Component } from "react";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  //replace with enum
  language: string;
  code: string;
}

type FileBarProps = {
  files: { [key: string]: File };
};

export default class FileBar extends Component<FileBarProps> {
  constructor(props: FileBarProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={fileBarStyles.FileBar}>
        <button>+</button>
      </div>
    );
  }
}
