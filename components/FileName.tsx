import React, { Component, ReactElement, useState } from "react";
const fileNamesStyle = require("../styles/FileNames.module.scss");

type FileNameProps = {
  selected: boolean;
  changeSelectedFile: (fileIndex: number) => void;
  name: string;
  deleteFile: (toDeleteIndex: number) => void;
  index: number;
};

export default function FileName(props: FileNameProps) {
  let [hovered, toggleHover] = useState(false);

  let style = {
    color: "white",
  };
  if (!props.selected) {
    style.color = "#898984";
  }

  function renderButton() {
    if (hovered) {
      return (
        <button
          className={fileNamesStyle["Close"]}
          onClick={(e) => props.deleteFile(props.index)}
        >
          X
        </button>
      );
    } else {
      return <div></div>;
    }
  }

  return (
    <div
      onMouseEnter={(e) => toggleHover(true)}
      onMouseLeave={(e) => toggleHover(false)}
      style={style}
      className={fileNamesStyle["NameWrapper"]}
    >
      <div
        onClick={(e) => {
          props.changeSelectedFile(props.index);
        }}
      >
        {props.name}
      </div>
      {renderButton()}
    </div>
  );
}
