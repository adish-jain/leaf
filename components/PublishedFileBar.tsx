import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";
import { filenames, Language, reactString, jsxString } from "./code_string";
const fileBarStyles = require("../styles/FileBar.module.scss");

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type PublishedFileBarProps = {
  files: File[];
};

export default function PublishedFileBar(props: PublishedFileBarProps) {
  return (
    <div className={fileBarStyles["published-filebar"]}>
      {props.files.map((file) => (
        <File key={file.id} name={file.name} />
      ))}
    </div>
  );
}

function File(props: { name: string }) {
  return <div>{props.name}</div>;
}
