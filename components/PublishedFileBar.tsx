import React, { Component, useContext } from "react";
import { PublishedFilesContext } from "../contexts/finishedpost/files-context";
import fileBarStyles from "../styles/filebar.module.scss";
import fileNameStyles from "../styles/filenames.module.scss";

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type PublishedFileBarProps = {};

export default function PublishedFileBar(props: PublishedFileBarProps) {
  const { files, selectedFileIndex } = useContext(PublishedFilesContext);
  return (
    <div className={fileBarStyles["published-filebar"]}>
      <div className={fileBarStyles["files"]}>
        {files.map((file, index) => (
          <File
            key={file.fileId}
            index={index}
            name={file.fileName}
            selected={index === selectedFileIndex}
          />
        ))}
      </div>
    </div>
  );
}

function File(props: { name: string; index: number; selected: boolean }) {
  let wrapperClass;
  props.selected
    ? (wrapperClass = "filename-wrapper-selected")
    : (wrapperClass = "filename-wrapper");
  const { updateFileIndex } = useContext(PublishedFilesContext);
  return (
    <div
      onClick={(e) => updateFileIndex(props.index)}
      className={fileNameStyles[wrapperClass]}
    >
      {props.name}
    </div>
  );
}
