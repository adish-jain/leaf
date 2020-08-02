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
          onClick={(e) => props.removeFile(props.index)}
        >
          X
        </button>
      );
    } else {
      return <div></div>;
    }
  }

  function onNameChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    props.onNameChange(e.target.value);
  }

  function saveFileName() {
    props.saveFileName(props.name, true);
    dblClick(false);
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

      <div
        onDoubleClick={(e) => {
          dblClick(true);
        }}
      >
        {editing ? 
          (<textarea
            className={fileNamesStyle["filenames"]}
            defaultValue={props.name}
            onChange={onNameChange}
            onBlur={saveFileName}
            name="fileName"
          />) 
          : props.name
        }        
      </div>
      </div>
      {renderButton()}
    </div>
  );
}
