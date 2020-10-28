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
}
