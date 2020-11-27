import React, { Component, useEffect, useRef, useState } from "react";
import FileName from "./FileName";
import "../styles/filebar.scss";
import { AnimatePresence, motion } from "framer-motion";
import { fileObject } from "../typescript/types/frontend/postTypes";
import { FilesContext } from "../contexts/files-context";

type File = {
  id: string;
  name: string;
  //replace with enum
  language: string;
  code: string;
};

type FileBarProps = {
  files: fileObject[];
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
      // hide scroll bar if there are too few files
      let newScrollBarWidth =
        width / totalWidth === 1 ? 0 : (width / totalWidth) * width;
      let newScroll = (width / totalWidth) * scrollPos;
      updateScroll(newScroll);
      updateScrollBarWidth(newScrollBarWidth);
    }

    function handleScroll() {
      recalculate();
    }

    let {
      onNameChange,
      selectedFileIndex,
      removeFile,
      changeSelectedFile,
      addFile,
    } = this.props;

    return (
      <FilesContext.Consumer>
        {({ files, removeFile, selectedFile, saveFileName }) => (
          <div className={"filebar"}>
            <div ref={FileBarRef} onScroll={handleScroll} className={"files"}>
              {files.map((file, index) => (
                <FileName
                  name={file.fileName}
                  key={file.fileId}
                  changeSelectedFile={changeSelectedFile}
                  saveFileName={saveFileName}
                  onNameChange={onNameChange}
                  selected={selectedFile?.fileId === file.fileId}
                  removeFile={removeFile}
                  index={index}
                />
              ))}
            </div>
            <Scrollbar
              scrollPos={scrollOffset}
              scrollBarWidth={scrollBarWidth}
            />
            <button className={"new-file"} onClick={(e) => addFile()}>
              +
            </button>
          </div>
        )}
      </FilesContext.Consumer>
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
      <div className={"filebar-wrapper"}>
        <div className={"title-with-divider"}>
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
  return <div style={style} ref={scrollBarRef} className={"scrollbar"}></div>;
}
