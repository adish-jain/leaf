import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import "../styles/languagebar.scss";

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
    <div className={"published-language-bar"}>
      <label>Language:<span> {props.language}</span></label>
    </div>
  );
}
