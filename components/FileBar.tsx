import React, { Component, useEffect, useRef, useState } from "react";
import FileName from "./FileName";
import fileBarStyles from "../styles/filebar.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { fileObject } from "../typescript/types/frontend/postTypes";
import { FilesContext } from "../contexts/files-context";

type FileBarProps = {};

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

    return (
      <FilesContext.Consumer>
        {({
          files,
          removeFile,
          selectedFile,
          saveFileName,
          addFile,
          changeSelectedFileIndex,
        }) => {
          return (
            <div className={fileBarStyles["filebar"]}>
              <div
                ref={FileBarRef}
                onScroll={handleScroll}
                className={fileBarStyles["files"]}
              >
                {files.map((file, index) => (
                  <FileName
                    name={file.fileName}
                    key={file.fileId}
                    selected={selectedFile?.fileId === file.fileId}
                    index={index}
                  />
                ))}
              </div>
              <Scrollbar
                scrollPos={scrollOffset}
                scrollBarWidth={scrollBarWidth}
              />
              <button
                className={fileBarStyles["new-file"]}
                onClick={(e) => addFile()}
              >
                +
              </button>
            </div>
          );
        }}
      </FilesContext.Consumer>
    );
  };

  render() {
    let {} = this.props;

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
