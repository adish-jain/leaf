import React, { Component } from "react";
const fileBarStyles = require("../styles/FileBar.module.scss");

type FileBarProps = {};

export default class FileBar extends Component<FileBarProps> {
  constructor(props: FileBarProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={fileBarStyles.FileBar}>

    </div>;
  }
}
