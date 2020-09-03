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
  const [hideLeft, toggleHideLeft] = useState(true);
  const [hideRight, toggleHideRight] = useState(true);
  const options = {
    elementToScroll: fileBarWrapperRef.current!,
  };

  useEffect(() => {
    let width = fileBarWrapperRef.current?.offsetWidth!;
    let total_width = fileBarRef.current?.scrollWidth!;
    let scrollPos = fileBarWrapperRef.current?.scrollLeft!;
    if (scrollPos < total_width - width) {
      toggleHideRight(false);
    } else {
      toggleHideRight(true);
    }

    let currentFileElement = document.getElementById(props.currentFile.id);
    let overrideOptions = {
      elementToScroll: fileBarWrapperRef.current!,
    };
    animateScrollTo(currentFileElement!, overrideOptions);
  }, [props.currentFile.id]);

  function moveRight() {
    let width = fileBarWrapperRef.current?.offsetWidth!;
    let total_width = fileBarRef.current?.scrollWidth!;
    let scrollPos = fileBarWrapperRef.current?.scrollLeft!;
    let newScrollValue = scrollPos + width;
    animateScrollTo([newScrollValue, null], options);
  }

  function moveLeft() {
    let width = fileBarWrapperRef.current?.offsetWidth!;
    let scrollPos = fileBarWrapperRef.current?.scrollLeft!;
    let newScrollValue = scrollPos - width;
    animateScrollTo([newScrollValue, null], options);
  }

  function LeftButton() {
    if (hideLeft) {
      return <div></div>;
    }
    return (
      <button
        onClick={moveLeft}
        className={fileBarStyles["published-filebar-left"]}
      >
        <img className={fileBarStyles["arrow-left"]} src="/images/warrow.svg" />
      </button>
    );
  }

  function RightButton() {
    let total_width = fileBarRef.current?.scrollWidth!;
    let width = fileBarWrapperRef.current?.offsetWidth!;
    if (hideRight) {
      return <div></div>;
    }
    return (
      <button
        onClick={moveRight}
        className={fileBarStyles["published-filebar-right"]}
      >
        <div className={"arrow-button-wrapper"}>
          <img
            className={fileBarStyles["arrow-right"]}
            src="/images/warrow.svg"
          />
        </div>
      </button>
    );
  }

  function handleScroll(e: React.UIEvent<HTMLElement>) {
    let scrollPos = fileBarWrapperRef.current?.scrollLeft!;
    let total_width = fileBarRef.current?.scrollWidth!;
    let width = fileBarWrapperRef.current?.offsetWidth!;

    if (scrollPos > width) {
      toggleHideLeft(false);
    } else {
      toggleHideLeft(true);
    }
    if (scrollPos < total_width - width) {
      toggleHideRight(false);
    } else {
      toggleHideRight(true);
    }
  }

  return (
    <div
      ref={fileBarWrapperRef}
      className={fileBarStyles["published-filebar-wrapper"]}
      onScroll={(e) => handleScroll(e)}
    >
      <LeftButton />
      <div
        onScroll={(e) => handleScroll(e)}
        ref={fileBarRef}
        className={fileBarStyles["published-filebar"]}
      >
        {props.files.map((file, index) => (
          <File
            key={file.id}
            id={file.id}
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
  id: string;
  updateFile: (fileIndex: number) => void;
}) {
  const fileNameRef = React.useRef<HTMLDivElement>(null);

  let className = "published-file";
  if (props.selected) {
    className = "published-file-selected";
  }

  return (
    <div
      onClick={(e) => props.updateFile(props.index)}
      className={fileBarStyles[className]}
      ref={fileNameRef}
      id={props.id}
    >
      {props.name}
    </div>
  );
}
