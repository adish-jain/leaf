import React, { Component } from "react";
const languageBarStyles = require("../styles/LanguageBar.module.scss");

type LanguageBarProps = {
  language: string;
  handleLanguageChange: (language: string) => void;
};

type LanguageBarState = {
  language: string;
};

export default class CodeMirror extends Component<
  LanguageBarProps,
  LanguageBarState
> {
  constructor(props: LanguageBarProps) {
    super(props);

    this.state = {
      language: this.props.language,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLSelectElement>) {
    this.setState({
      language: e.currentTarget.value,
    });
    this.props.handleLanguageChange(e.currentTarget.value);
  }

  render() {
    return (
      <div className={languageBarStyles.LanguageBar}>
        <label>
          Language:
          <select onChange={this.handleChange} value={this.state.language}>
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
