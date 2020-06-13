import React, { Component } from "react";
const languageBarStyles = require("../styles/LanguageBar.module.scss");

type LanguageBarProps = {
  language: string;
};

type LanguageBarState = {};

export default class CodeMirror extends Component<
  LanguageBarProps,
  LanguageBarState
> {
  constructor(props: LanguageBarProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className={languageBarStyles.LanguageBar}>
        <label>
        Language:
        <select>
          <option value="jsx">JSX</option>
          <option value="javascript">Javascript</option>
          <option selected value="html">
            HTML
          </option>
          <option value="python">Python</option>
        </select>
        </label>
      </div>
    );
  }
}
