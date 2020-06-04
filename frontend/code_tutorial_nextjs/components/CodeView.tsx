import React, { Component } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { filenames, Language, reactString } from "./code_string";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";

const codeViewStyles = require("../styles/CodeView.module.scss");

type CodeViewProps = {
  selected_file: number;
};

type CodeViewState = {
  language: Language;
  code: string;
};

export class CodeView extends Component<CodeViewProps, CodeViewState> {
  textInput: HTMLTextAreaElement | null;
  constructor(props: CodeViewProps) {
    super(props);

    this.textInput = null;

    this.state = {
      language: Language.jsx,
      code: reactString,
    };
  }

  componentDidUpdate(prevProps: CodeViewProps, prevstate: CodeViewState) {
    let { selected_file } = this.props;
    if (prevProps.selected_file !== selected_file) {
      this.setState({
        language: filenames[selected_file].language,
      });
    }
  }

  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log(e);
    this.setState({
      code: e.target.value,
    });
  }

  handleLineClick(e: React.ChangeEvent<HTMLTextAreaElement>) {}

  setCursorPosition(e: React.MouseEvent<HTMLElement>, lineNumber: number) {
    let textInput = this.textInput;
    if (textInput === null) {
      return;
    }

    let selection = window.getSelection();
    if (selection === null) {
      return;
    }

    let arrayOfLines = textInput.value.split("\n");

    let range = selection.getRangeAt(0),
      target = e.target as HTMLElement,
      setPoint;

    let to_print = target.previousSibling;
    if (to_print === null) {
      console.log("to print is null");
      range.setStart(target, 0);
      return;
    }
    range.setStart(to_print, 0);
    while (to_print !== null) {
      if (to_print.previousSibling === null) {
        range.setStart(to_print, 0);
      }
      to_print = to_print.previousSibling;
    }

    console.log(range.toString());
    console.log(range.toString().length);
    setPoint = range.toString().length;

    // let count: number = 0;
    // for (let i = 0; i < lineNumber - 1; i++) {
    //   count += arrayOfLines[i].length;
    // }
    // count = count + setPoint;

    textInput.focus();
    textInput.setSelectionRange(setPoint, setPoint);
  }

  getBaseLog(x: number, y: number): number {
    return Math.log(y) / Math.log(x);
  }

  render() {
    let { selected_file } = this.props;
    let { code } = this.state;

    let numLines: number = code.split("\n").length;

    /*
     * Lines 0-9 have left: 30.4px
     * Everytime a digit is added, 10px is added, so
     * Lines 100-999 have left: 40.4px
     */
    let left: number = 30.4 + 8.5 * Math.floor(this.getBaseLog(10, numLines));

    return (
      <div className={codeViewStyles.codeView}>
        <div className={codeViewStyles.codeView}>
          <textarea
            id="mytext"
            cols={80}
            ref={(elem) => (this.textInput = elem)}
            onChange={this.handleChange.bind(this)}
            className={codeViewStyles.backtext}
            value={this.state.code}
            style={{
              left: left + "px",
            }}
          ></textarea>
          <div id="lineNo"></div>
          <SyntaxHighlighter
            showLineNumbers={true}
            language={this.state.language}
            style={okaidia}
            customStyle={{
              fontSize: "14px",
              background: "#22221d",
            }}
            wrapLines={true}
            lineProps={(lineNumber: number) => {
              return {
                onClick: (e: React.MouseEvent<HTMLElement>) => {
                  // console.log(lineNumber);
                  // console.log(e);
                  // e.persist();
                  this.setCursorPosition(e, lineNumber);
                  this.textInput?.focus();
                },
                style: {
                  // backgroundColor: "red",
                  width: "100%",
                },
              };
            }}
          >
            {this.state.code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
}
