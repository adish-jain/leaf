import React, { Component } from "react";
const languageBarStyles = require("../styles/LanguageBar.module.scss");

type LanguageBarProps = {
  language: string;
  changeFileLanguage: (language: string) => void;
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
    this.props.changeFileLanguage(e.currentTarget.value);
  }

  render() {
    return (
      <div className={languageBarStyles.LanguageBar}>
        <label>
          Language:
          <select onChange={this.handleChange} value={this.props.language}>
            <option value="jsx">JSX</option>
            <option value="javascript">Javascript</option>
            <option value="xml">HTML</option>
            <option value="python">Python</option>
          </select>
        </label>
      </div>
    );
  }
}
