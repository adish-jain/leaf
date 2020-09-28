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
            <option value="jsx">JSX</option>
            <option value="typescript">Typescript</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="plaintext">Text</option>
          </select>
        </label>
      </div>
    );
  }
}
