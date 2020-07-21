import React, { Component, ReactElement, useState } from "react";
const fileNamesStyle = require("../styles/FileNames.module.scss");

type FileNameProps = {
  selected: boolean;
  changeSelectedFile: (fileIndex: number) => void;
  saveFileName: (value: string, external: boolean) => void;
  name: string;
  removeFile: (toDeleteIndex: number) => void;
  index: number;
};


export default function FileName(props: FileNameProps) {
  let [hovered, toggleHover] = useState(false);
  let [editing, dblClick] = useState(false);
  let [name, newName] = useState(props.name);

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
    newName(e.target.value);
  }

  function saveFileName() {
    // console.log("blur");
    props.saveFileName(name, true);
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

      {/* <div
        onBlur={(e) => {
          console.log("blur1");
          saveFileName();
      }}> */}
        {editing ? 
          (<textarea
            className={fileNamesStyle["filenames"]}
            defaultValue={name}
            onChange={onNameChange}
            onBlur={saveFileName}
            name="title"
          />) 
          : name
        }        
      </div>
      </div>
      {/* </div> */}
      {renderButton()}
    </div>
  );
}
