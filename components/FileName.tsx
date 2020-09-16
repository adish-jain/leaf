import React, { Component, ReactElement, useState } from "react";
const fileNamesStyle = require("../styles/FileNames.module.scss");

type FileNameProps = {
  selected: boolean;
  changeSelectedFile: (fileIndex: number) => void;
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  name: string;
  removeFile: (toDeleteIndex: number) => void;
  index: number;
};

export default function FileName(props: FileNameProps) {
  let [hovered, toggleHover] = useState(false);
  let [editing, dblClick] = useState(false);

  // let style = {
  //   color: "white",
  //   backgroundColor: "#349AE9",
  // };
  // if (!props.selected) {
  //   style.color = "black";
  //   style.backgroundColor = "white";
  // }

  function renderButton() {
    if (hovered && props.selected) {
      return (
        <div
          className={fileNamesStyle["close-button"]}
          onClick={(e) => props.removeFile(props.index)}
        >
          x
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  function saveFileName() {
    props.saveFileName(props.name, true);
    dblClick(false);
  }

  let wrapperClass;
  props.selected
    ? (wrapperClass = "filename-wrapper-selected")
    : (wrapperClass = "filename-wrapper");

  return (
    <div
      onMouseEnter={(e) => toggleHover(true)}
      onMouseLeave={(e) => toggleHover(false)}
      // style={style}
      className={fileNamesStyle[wrapperClass]}
    >
      <div
        onClick={(e) => {
          props.changeSelectedFile(props.index);
        }}
        onDoubleClick={(e) => {
          dblClick(true);
        }}
      >
        {editing ? (
          <input
            className={fileNamesStyle["filenames"]}
            defaultValue={props.name}
            onChange={(e) => props.onNameChange(e.target.value)}
            onBlur={saveFileName}
            name="fileName"
            autoFocus={true}
          />
        ) : (
          <label>{props.name}</label>
        )}
      </div>
      {renderButton()}
    </div>
  );
}
