import React, { Component } from "react";
const languageBarStyles = require("../styles/LanguageBar.module.scss");

type LanguageBarProps = {
  language: string;
  changeFileLanguage: (language: string, external: boolean) => void;
};

type LanguageBarState = {
};

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
      <div className={languageBarStyles.LanguageBar}>
        <label>
          Language:
          <select onChange={this.handleChange} value={this.props.language}>
            <option value="xml">HTML</option>
            <option value="css">CSS</option>
            <option value="jsx">JSX</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="text/x-csrc">C</option>
            <option value="text/x-c++src">C++</option>
            <option value="text/x-java">Java</option>
            <option value="go">Go</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="textile">Text</option>

          </select>
        </label>
      </div>
    );
  }
}
