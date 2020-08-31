import React, { Component, useRef, useState, useEffect } from "react";
const fileBarStyles = require("../styles/FileBar.module.scss");
import animateScrollTo from "animated-scroll-to";

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type PublishedFileBarProps = {
  files: File[];
  updateFile: (fileIndex: number) => void;
  currentFile: File;
};

export default function PublishedFileBar(props: PublishedFileBarProps) {
  const fileBarWrapperRef = React.useRef<HTMLDivElement>(null);
  const fileBarRef = React.useRef<HTMLDivElement>(null);
  const [scrollValue, updateScrollValue] = useState(0);

  useEffect(() => {
    const options = {
      elementToScroll: fileBarWrapperRef.current!,
    };
    animateScrollTo([scrollValue, null], options);
  }, [scrollValue]);

  function showRight() {
    let width = fileBarWrapperRef.current?.offsetWidth!;
    let total_width = fileBarRef.current?.scrollWidth!;
    if (!(scrollValue + width >= total_width)) {
      updateScrollValue(scrollValue + width);
    } else {
      updateScrollValue(total_width);
    }
  }

  function showLeft() {
    let width = fileBarWrapperRef.current?.offsetWidth!;
    if (scrollValue > 0) {
      updateScrollValue(scrollValue - width);
    }
  }

  function LeftButton() {
    if (scrollValue === 0) {
      return <div></div>;
    }
    return (
      <button
        onClick={showLeft}
        className={fileBarStyles["published-filebar-left"]}
      >
        {"<"}
      </button>
    );
  }

  function RightButton() {
    let total_width = fileBarRef.current?.scrollWidth!;
    let width = fileBarWrapperRef.current?.offsetWidth!;
    if (scrollValue + width >= total_width) {
      return <div></div>;
    }
    return (
      <button
        onClick={showRight}
        className={fileBarStyles["published-filebar-right"]}
      >
        {">"}
      </button>
    );
  }

  return (
    <div
      ref={fileBarWrapperRef}
      className={fileBarStyles["published-filebar-wrapper"]}
    >
      <LeftButton />
      <div ref={fileBarRef} className={fileBarStyles["published-filebar"]}>
        {props.files.map((file, index) => (
          <File
            key={file.id}
            index={index}
            name={file.name}
            updateFile={props.updateFile}
            selected={file.name === props.currentFile.name}
          />
        ))}
      </div>
      <RightButton />
    </div>
  );
}

function File(props: {
  name: string;
  index: number;
  selected: boolean;
  updateFile: (fileIndex: number) => void;
}) {
  let className = "published-file";
  if (props.selected) {
    className = "published-file-selected";
  }
  return (
    <div
      onClick={(e) => props.updateFile(props.index)}
      className={fileBarStyles[className]}
    >
      {props.name}
    </div>
  );
}
