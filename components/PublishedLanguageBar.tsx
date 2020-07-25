import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";
const languageBarStyles = require("../styles/LanguageBar.module.scss");

type PublishedLanguageBarProps = {
  language: string;
};

type CodeMirrorState = {
  value: string;
};

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

export default function PublishedLanguageBar(props: PublishedLanguageBarProps) {
  return (
    <div className={languageBarStyles["published-language-bar"]}>
      {props.language}
    </div>
  );
}
