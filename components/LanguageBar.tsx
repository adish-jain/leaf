import React, { Component } from "react";
import "../styles/languagebar.scss";

type LanguageBarProps = {
  language: string;
  changeFileLanguage: (language: string, external: boolean) => void;
};

type LanguageBarState = {};

export default class CodeMirror extends Component<
  LanguageBarProps,
  LanguageBarState
> {
  constructor(props: LanguageBarProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLSelectElement>) {
    this.props.changeFileLanguage(e.currentTarget.value, true);
  }

  render() {
    return (
      <div className={"LanguageBar"}>
        <label>
          Language:
          <select
            onChange={this.handleChange}
            value={
              this.props.language !== "textile"
                ? this.props.language
                : "plaintext"
            }
          >
            <option value="xml">HTML</option>
            <option value="css">CSS</option>
            <option value="scss">SCSS</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="typescript">Typescript</option>
            <option value="tsx">Typescript React</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="objective-c">Objective C</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <option value="plaintext">Text</option>
          </select>
        </label>
      </div>
    );
  }
}

let PrismLanguageString = {
  xml: "html",
  css: "css",
  jsx: "jsx",
  yaml: "yaml",
  json: "json",
  javascript: "javascript",
  typescript: "tsx",
  python: "python",
  java: "java",
  go: "go",
  php: "php",
  ruby: "ruby",
  "objective-c": "objectivec",
  plaintext: "textile",
  "c++": "cpp",
  c: "c",
};
