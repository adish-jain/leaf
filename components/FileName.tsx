import React, { Component, ReactElement } from "react";
const fileNamesStyle = require("../styles/FileNames.module.scss");

type FileNameProps = {
  selected: boolean;
  changeSelected: (selected_file: string) => void;
  name: string;
};

export default function FileName(props: FileNameProps) {
  let style = {
    color: "white",
  };
  if (!props.selected) {
    style.color = "#898984";
  }

  return (
    <div
      style={style}
      onClick={(e) => {
        props.changeSelected(props.name);
      }}
      className={fileNamesStyle.filename}
    >
      {props.name}
    </div>
  );
}
