import React, { Component, useEffect, useRef, useState } from "react";
import FileName from "./FileName";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  id: string;
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type FileBarProps = {
  draftId: string;
  files: File[];
  changeSelectedFile: (fileIndex: number) => void;
  saveFileName: (value: string, external: boolean) => void;
  onNameChange: (name: string) => void;
  addFile: () => void;
  removeFile: (toDeleteIndex: number) => void;
  selectedFileIndex: number;
};

export default class FileBar extends Component<FileBarProps> {
  constructor(props: FileBarProps) {
    super(props);
    this.state = {};
  }

  FileBarFiles = () => {
    const FileBarRef = useRef<HTMLDivElement>(null);
    const [scrollOffset, updateScroll] = useState(0);
    const [scrollBarWidth, updateScrollBarWidth] = useState(0);
    useEffect(() => {
      recalculate();
    });

    function recalculate() {
      let scrollPos = FileBarRef.current?.scrollLeft!;
      let width = FileBarRef.current?.offsetWidth!;
      let totalWidth = FileBarRef.current?.scrollWidth!;
      let newScrollBarWidth = (width / totalWidth) * width;
      let newScroll = (width / totalWidth) * scrollPos;
      updateScroll(newScroll);
      updateScrollBarWidth(newScrollBarWidth);
    }

    function handleScroll() {
      recalculate();
    }

    let {
      files,
      saveFileName,
      onNameChange,
      selectedFileIndex,
      removeFile,
      changeSelectedFile,
      addFile,
    } = this.props;

    return (
      <div className={fileBarStyles["filebar"]}>
        <div
          ref={FileBarRef}
          onScroll={handleScroll}
          className={fileBarStyles["files"]}
        >
          {files.map((file, index) => (
            <FileName
              name={file.name}
              key={file.id}
              changeSelectedFile={changeSelectedFile}
              saveFileName={saveFileName}
              onNameChange={onNameChange}
              selected={selectedFileIndex === index}
              removeFile={removeFile}
              index={index}
            />
          ))}
        </div>
        <Scrollbar scrollPos={scrollOffset} scrollBarWidth={scrollBarWidth} />
        <button
          className={fileBarStyles["new-file"]}
          onClick={(e) => addFile()}
        >
          +
        </button>
      </div>
    );
  };

  render() {
    let {
      draftId,
      files,
      changeSelectedFile,
      saveFileName,
      onNameChange,
      addFile,
      removeFile,
      selectedFileIndex,
    } = this.props;

    return (
      <div className={fileBarStyles["filebar-wrapper"]}>
        <div className={fileBarStyles["title-with-divider"]}>
          <label>files</label>
          <div></div>
        </div>
        <this.FileBarFiles />
      </div>
    );
  }
}

function Scrollbar(props: { scrollPos: number; scrollBarWidth: number }) {
  const scrollBarRef = React.useRef<HTMLDivElement>(null);
  let style = {
    width: props.scrollBarWidth + "px",
    left: props.scrollPos + "px",
  };
  return (
    <div
      style={style}
      ref={scrollBarRef}
      className={fileBarStyles["scrollbar"]}
    ></div>
  );
}
