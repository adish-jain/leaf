// @refresh reset

import Prism, { Token } from "prismjs";
import React, { useState, useCallback, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Node, Text, createEditor, Element } from "slate";
import { withHistory } from "slate-history";
import { css } from "emotion";

// eslint-disable-next-line

// Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore

const MarkdownPreviewExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props) => {
    // console.log("render element called");
    // console.log(props);
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const decorate = useCallback(([node, path]) => {
    const ranges: any = [];

    if (!Text.isText(node)) {
      return ranges;
    }
    // console.log(node.text);

    const getLength = (token: any) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;
      if (typeof token !== "string") {
        if (token.type === "title") {
          //   console.log("token type is title");
          //   console.log((token.content as Token[])[0].content);
          switch ((token.content as Token[])[0].content) {
            case "#":
              token.type = "h1";
              // code block
              break;
            case "##":
              token.type = "h2";
              // code block
              break;
            case "###":
              token.type = "h3";
            default:
            // code block
          }
        }
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  function addBlock() {
    let newNode: Node = {
      children: [
        {
          text: "",
        },
      ],
    };
    console.log(value);
    setValue([...value, newNode]);
  }

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          placeholder="Write some markdown..."
        />
      </Slate>
      <button
        onClick={(e) => {
          addBlock();
        }}
      >
        Add block
      </button>
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  //   console.log(leaf);
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && "bold"};
        font-style: ${leaf.italic && "italic"};
        text-decoration: ${leaf.underlined && "underline"};
        ${leaf.title &&
        css`
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          margin: 20px 0 10px 0;
        `}
        ${leaf.list &&
        css`
          padding-left: 10px;
          font-size: 20px;
          line-height: 10px;
        `}
        ${leaf.hr &&
        css`
          display: block;
          text-align: center;
          border-bottom: 2px solid #ddd;
        `}
        ${leaf.blockquote &&
        css`
          display: inline-block;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          color: #aaa;
          font-style: italic;
        `}
        ${leaf.code &&
        css`
          font-family: monospace;
          background-color: #eee;
          padding: 3px;
        `}
      `}
    >
      {children}
    </span>
  );
};

const initialValue = [
  {
    children: [
      {
        text:
          "Slate is flexible enough to add **decorations** that can format text based on its content. For example, this editor has **Markdown** preview decorations on it, to make it _dead_ simple to make an editor with built-in Markdown previewing.",
      },
    ],
  },
  {
    children: [{ text: "## Try it out!" }],
  },
  {
    children: [{ text: "Try it out for yourself!" }],
  },
];

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export default MarkdownPreviewExample;
