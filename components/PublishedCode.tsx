import React, { Component } from "react";
import { filenames, Language, reactString, jsxString } from "./code_string";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
 import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
 import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";

export default class PublishedCode extends Component {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <SyntaxHighlighter language="javascript" style={okaidia}>
          {reactString}
        </SyntaxHighlighter>
      </div>
    );
  }
}
