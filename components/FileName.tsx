import React, { Component, ReactElement, useContext, useState } from "react";
import { FilesContext } from "../contexts/files-context";
import fileStyles from "../styles/filenames.module.scss";

type FileNameProps = {
  selected: boolean;
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  name: string;
  removeFile: (toDeleteIndex: number) => void;
  index: number;
};

export default function FileName(props: FileNameProps) {
  let [hovered, toggleHover] = useState(false);
  let [editing, dblClick] = useState(false);
  const filesContext = useContext(FilesContext);
  const { changeSelectedFileIndex } = filesContext;
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
          className={fileStyles["close-button"]}
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
      className={fileStyles[wrapperClass]}
    >
      <div
        onClick={(e) => {
          changeSelectedFileIndex(props.index);
        }}
        onDoubleClick={(e) => {
          dblClick(true);
        }}
      >
        {editing ? (
          <input
            className={fileStyles["filenames"]}
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
