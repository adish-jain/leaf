import React, { Component, useContext } from "react";
import { FilesContext } from "../contexts/files-context";
import languageBarStyles from "../styles/languagebar.module.scss";
import {
  languageStrings,
  ProgrammingLanguage,
} from "../typescript/types/language_types";

type LanguageBarProps = {};

type LanguageBarState = {};

export default function LanguageBar(props: LanguageBarProps) {
  const filesContext = useContext(FilesContext);
  const { changeFileLanguage, files, selectedFileIndex } = filesContext;
  async function handleChange(e: React.FormEvent<HTMLSelectElement>) {
    await changeFileLanguage(e.currentTarget.value, true);
  }
  // console.log(files);
  let languageOptions = [];
  Object.entries(languageStrings).forEach((record) => {
    let languageName = record[0];
    languageOptions.push(languageName);
  });
  let selectedFile = files[selectedFileIndex];
  // console.log(selectedFile);
  const selectedLanguage = selectedFile?.language || "plaintext";
  return (
    <div className={languageBarStyles["LanguageBar"]}>
      <label>
        Language:
        <select
          onChange={handleChange}
          value={
            selectedLanguage !== "textile" ? selectedLanguage : "plaintext"
          }
        >
          <option value="html">HTML</option>
          <option value="xml">XML</option>
          <option value="css">CSS</option>
          <option value="scss">SCSS</option>
          <option value="yaml">YAML</option>
          <option value="json">JSON</option>
          <option value="typescript">Typescript</option>
          <option value="javascript">Javascript</option>
          <option value="tsx">Typescript React</option>
          <option value="jsx">Javascript React</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="swift">Swift</option>
          <option value="objective-c">Objective C</option>
          <option value="c">C</option>
          <option value="c++">C++</option>
          <option value="plaintext">Text</option>
          <option value="markdown">Markdown</option>
          <option value="dockerfile">Dockerfile</option>
        </select>
      </label>
    </div>
  );
}
