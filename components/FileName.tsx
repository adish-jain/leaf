import React, { Component, ReactElement, useContext, useState } from "react";
import { DraftContext } from "../contexts/draft-context";
import { FilesContext } from "../contexts/files-context";
import fileStyles from "../styles/filenames.module.scss";

type FileNameProps = {
  selected: boolean;
  name: string;
  index: number;
};

export default function FileName(props: FileNameProps) {
  let [hovered, toggleHover] = useState(false);
  let [editing, dblClick] = useState(false);
  const {
    changeSelectedFileIndex,
    modifyFileName,
    saveFileName,
    removeFile,
  } = useContext(FilesContext);
  const { removeFileFromCodeSteps } = useContext(DraftContext);
  const { index, selected } = props;
  // let style = {
  //   color: "white",
  //   backgroundColor: "#349AE9",
  // };
  // if (!props.selected) {
  //   style.color = "black";
  //   style.backgroundColor = "white";
  // }

  function saveFileNameWrapper() {
    saveFileName(props.name, true);
    dblClick(false);
  }

  let wrapperClass = selected
    ? "filename-wrapper-selected"
    : "filename-wrapper";

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
            onChange={(e) => modifyFileName(e.target.value, index)}
            onBlur={saveFileNameWrapper}
            name="fileName"
            autoFocus={true}
          />
        ) : (
          <label>{props.name}</label>
        )}
      </div>
      <RenderButton index={index} hovered={hovered} selected={selected} />
    </div>
  );
}

function RenderButton(props: {
  hovered: boolean;
  selected: boolean;
  index: number;
}) {
  const { hovered, selected, index } = props;
  const { removeFile, files } = useContext(FilesContext);
  const { removeFileFromCodeSteps } = useContext(DraftContext);

  if (hovered && selected) {
    return (
      <div
        className={fileStyles["close-button"]}
        onClick={(e) => {
          removeFile(index);
          removeFileFromCodeSteps(files[index].fileId);
        }}
      >
        x
      </div>
    );
  } else {
    return <div></div>;
  }
}
