import React, { Component, useContext } from "react";
import { ContentContext } from "../contexts/finishedpost/content-context";
import { PublishedFilesContext } from "../contexts/finishedpost/files-context";
import languageBarStyles from "../styles/languagebar.module.scss";

export default function PublishedLanguageBar(props: {}) {
  const { files, selectedFileIndex } = useContext(PublishedFilesContext);
  const currentFile = files[selectedFileIndex];
  return (
    <div className={languageBarStyles["published-language-bar"]}>
      <label>
        Language:<span> {currentFile.language}</span>
      </label>
    </div>
  );
}
