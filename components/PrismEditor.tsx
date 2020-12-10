import Prism from "prismjs";
import React, { Component, useContext, useEffect, useState } from "react";
import { File, Step } from "../typescript/types/app_types";
import { getPrismLanguageFromBackend } from "../lib/utils/languageUtils";
const isBrowser = () => typeof window !== "undefined";
import { Node } from "slate";

// prevents prism from highlighting immediately
if (isBrowser()) {
  window.Prism = window.Prism || {};
  //@ts-ignore
  Prism.manual = true;
}

//html, xml
import "prismjs/components/prism-markup.min";
// css, scss
import "prismjs/components/prism-css.min";
import "prismjs/components/prism-scss.min";
// yaml
import "prismjs/components/prism-yaml.min";
// json
import "prismjs/components/prism-json";
// typescript
import "prismjs/components/prism-typescript.min";
// tsx, jsx, javascript
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
// python
import "prismjs/components/prism-python.min";
// java
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-clike.min";
// go
import "prismjs/components/prism-go.min";
// php
import "prismjs/components/prism-php.min";
import "prismjs/components/prism-markup-templating.min";
// ruby
import "prismjs/components/prism-ruby.min";
// rust
import "prismjs/components/prism-rust.min";
// swift
import "prismjs/components/prism-swift.min";
// c
import "prismjs/components/prism-c.min";
// objectivec
import "prismjs/components/prism-objectivec";
// c++
import "prismjs/components/prism-cpp.min";
// textile/plaintext
import "prismjs/components/prism-textile.min";
// markdown
import "prismjs/components/prism-markdown.min";
// dockerfile
import "prismjs/components/prism-docker.min";

import prismStyles from "../styles/prismeditor.module.scss";
import { PublishedFilesContext } from "../contexts/finishedpost/files-context";
import { ContentContext } from "../contexts/finishedpost/content-context";

type PrismEditorProps = {
  prismWrapper: React.RefObject<HTMLDivElement>;
  animateLines: () => void;
};

function injectHTML(line: string) {
  return { __html: line };
}

export default function PrismEditor(props: PrismEditorProps) {
  const { files, selectedFileIndex } = useContext(PublishedFilesContext);
  const { postContent, selectedContentIndex } = useContext(ContentContext);
  const [hovered, updateHovered] = useState(false);
  const { prismWrapper } = props;
  const [highlightedFiles, updateHighlightedFiles] = useState<string[]>([]);
  useEffect(() => {
    updateHighlightedFiles(syntaxHighlightFiles());
  }, [files]);

  useEffect(() => {
    updateLines();
    return () => {};
  }, [selectedContentIndex]);

  useEffect(() => {
    prismWrapper.current!.scrollTop = 0;
    return () => {};
  }, [selectedFileIndex]);

  /*
  uses prism to create syntax higlighted code
  run once on mount and everytime a new file is added or removed.
  */
  function syntaxHighlightFiles() {
    const newArr = [];
    for (let i = 0; i < files.length; i++) {
      let prismLanguage = getPrismLanguageFromBackend(files[i].language);
      let highlightedCode = Prism.highlight(
        serialize(files[i].code),
        Prism.languages[prismLanguage],
        files[i].language
      );
      newArr.push(highlightedCode);
    }
    return newArr;
  }

  function updateLines() {
    let { animateLines } = props;
    let currentFile = files[selectedFileIndex];
    let currentContent = postContent[selectedContentIndex];
    if (
      currentContent &&
      currentContent.lines !== null &&
      currentContent.lines !== undefined
    ) {
      animateLines();
    }
  }

  return (
    <div
      onMouseEnter={(e) => updateHovered(true)}
      onMouseLeave={(e) => updateHovered(false)}
      ref={prismWrapper}
      className={prismStyles["prism-editor"]}
    >
      <RenderFile highlightedFiles={highlightedFiles} hovered={hovered} />
    </div>
  );
}

function RenderFile(props: { highlightedFiles: string[]; hovered: boolean }) {
  const { files, selectedFileIndex } = useContext(PublishedFilesContext);
  const { postContent, selectedContentIndex } = useContext(ContentContext);
  const { highlightedFiles, hovered } = props;
  let currentFile = files[selectedFileIndex];
  if (selectedFileIndex > highlightedFiles.length - 1) {
    return <div></div>;
  }
  let lines = highlightedFiles[selectedFileIndex].split(/\r?\n/);
  return <CodeFile key={currentFile.fileId} lines={lines} hovered={hovered} />;
}

function CodeFile(props: { lines: string[]; hovered: boolean }) {
  const { files, selectedFileIndex } = useContext(PublishedFilesContext);
  const { hovered, lines } = props;
  let currentFile = files[selectedFileIndex];
  let language = currentFile.language;
  let style = {
    background: "#2f3437",
    display: "block",
  };
  return (
    <div>
      <pre style={style} className={"line-numbers"}>
        <code className={`language-${language}`}>
          {lines.map((line, index) => (
            <Line
              key={`Line-${index}`}
              index={index}
              line={line}
              hovered={hovered}
            />
          ))}
        </code>
      </pre>
    </div>
  );
}

function Line(LineProps: { index: number; line: string; hovered: boolean }) {
  let { index, line, hovered } = LineProps;
  const { postContent, selectedContentIndex } = useContext(ContentContext);
  const { files, selectedFileIndex } = useContext(PublishedFilesContext);
  let currentContent = postContent[selectedContentIndex];
  let currentFile = files[selectedFileIndex];
  let lines = currentContent?.lines;
  let highlighted = "";
  let line_dim = "";
  let differentFile = currentFile?.fileId !== currentContent?.fileId;

  // highlight selected lines and dim unselected lines
  // undim all lines upon hover
  if (
    lines &&
    index >= lines.start - 1 &&
    index <= lines.end - 1 &&
    !differentFile
  ) {
    highlighted = "highlighted";
  } else if (!hovered && lines && !differentFile) {
    line_dim = "line-dim";
  }

  return (
    <div
      className={`${prismStyles[highlighted]} ${prismStyles["line-wrapper"]} ${prismStyles[line_dim]}`}
    >
      <span className={prismStyles["line-number"]}>{index}</span>
      <div
        className={prismStyles["line-content"]}
        dangerouslySetInnerHTML={injectHTML(line + "\n")}
      ></div>
    </div>
  );
}

function serialize(nodes: Node[]) {
  return nodes.map((n) => Node.string(n)).join("\n");
}
