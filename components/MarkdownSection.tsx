// @refresh reset

import Prism, { Token } from "prismjs";
import React, { useState, useCallback, useMemo, ReactElement } from "react";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  useSelected,
  useFocused,
} from "slate-react";
import {
  Node,
  Text,
  createEditor,
  Editor,
  Element,
  Transforms,
  Path,
  Range,
  NodeEntry,
  Operation,
  Point,
} from "slate";
import { withHistory } from "slate-history";
import { css } from "emotion";
import "../styles/slate-editor.scss";
import { isCollapsed } from "@udecode/slate-plugins";

const MarkdownPreviewExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Define a React component renderer for our code blocks.
  const PromptElement = () => {
    return (
      <div className={"prompt"}>
        <label
          contentEditable={false}
          onClick={(e) => e.preventDefault()}
          className={"placeholder-text"}
        >
          {"Press '/' for commands"}
        </label>
      </div>
    );
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    let selected = false;
    // let selection = props.children.props.selection;
    // if (selection !== null && Range.isCollapsed(selection)) {
    //   selected = true;
    // }
    let emptyText = props.element.children[0].text === "";
    // if (selected && emptyText) {
    //   return (
    //     <PromptElement emptyText={emptyText} selected={selected} {...props} />
    //   );
    // }
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      //   case "prompt":
      //     return (
      //       <PromptElement emptyText={emptyText} selected={selected} {...props} />
      //     );
      case "default":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const decorate = useCallback((currentNodeEntry: NodeEntry) => {
    let [node, path] = currentNodeEntry;

    // let dimensions = ReactEditor.toDOMNode(
    //   editor,
    //   node
    // ).getBoundingClientRect();

    if (!Text.isText(node)) {
      return [];
    }
    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    return addMarkDown(tokens as Token[], path);
  }, []);

  function addBlock() {
    let newNode: Node = {
      type: "prompt",
      children: [
        {
          text: "",
        },
      ],
    };
    Transforms.insertNodes(editor, newNode);
  }

  function reOrderBlock() {
    Transforms.moveNodes(editor, { at: [1], to: [3] });
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "/":
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    // switch (event.key) {
    //   case "ArrowUp": {
    //     refreshPrompt();
    //   }
    //   case "ArrowDown": {
    //     refreshPrompt();
    //   }
    // }
  }

  function refreshPrompt() {
    let selection = editor.selection;
    if (selection !== null) {
      //   clear all prompts
      Transforms.setNodes(
        editor,
        { type: "default" },
        {
          match: (n) => {
            return n.type === "prompt";
          },
          at: [],
        }
      );
      if (Range.isCollapsed(selection)) {
        Transforms.setNodes(
          editor,
          { type: "prompt" },
          {
            // match: (n) => {
            //   return Editor.isBlock(editor, n);
            // },
            at: selection.anchor,
          }
        );
      }
    }
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let selection = editor.selection;
    if (
      selection !== null

      // && !Range.isCollapsed(selection)
    ) {
      //   refreshPrompt();

      let selectedNode = editor.children[selection.anchor.path[0]];
      let selectedNodeType = selectedNode.type;
      if (selectedNodeType == "default") {
        // ReactEditor.focus(editor);
        // Transforms.select(editor, selection.anchor.path);
        // Transforms.deselect(editor);
      }

      //   Transforms.select(editor, Editor.start(editor));
    }
  }

  const DefaultElement = (props: RenderElementProps) => {
    const selected = useSelected();
    const focused = useFocused();
    let thisPath: Point | null = null;
    let showThing = false;
    if (props.attributes.ref.current !== null) {
      thisPath = ReactEditor.toSlatePoint(editor, [
        props.attributes.ref.current,
        0,
      ]);

      let selection: Range | null = (props.children as ReactElement).props
        .selection;
      if (selection !== null) {
        // console.log(selection);
        // console.log(thisPath);
        let anchorIndex = selection.anchor.path[0];
        let focusIndex = selection.focus.path[0];
        let elemIndex = thisPath.path[0];
        // console.log("anchorIndex is ", anchorIndex);
        // console.log("focusIndex is ", focusIndex);
        // console.log("anchorIndex is ", anchorIndex);
        if (
          anchorIndex == focusIndex &&
          focusIndex == elemIndex &&
          elemIndex == anchorIndex &&
          Range.isCollapsed(selection)
        ) {
          console.log("show prompt for  line ", elemIndex);
          showThing = true;
        }
      } else {
        let elemIndex = thisPath.path[0];
        console.log("selection null for line ", elemIndex);
      }
    }

    //   console.log("selected is ", selected);
    // console.log("focused is ", focused);

    return (
      <div className={"prompt"}>
        <p className={"prompt-content"} {...props.attributes}>
          {props.children}
        </p>
        {selected && focused && (
          <label
            contentEditable={false}
            onClick={(e) => e.preventDefault()}
            className={"placeholder-text"}
          >
            {"Press '/' for commands"}
          </label>
        )}
      </div>
    );
  };

  function handleChange() {}

  return (
    <div className={"slate-wrapper"}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
        />
      </Slate>
      <button
        onClick={(e) => {
          addBlock();
        }}
      >
        Add block
      </button>
      <button
        onClick={(e) => {
          reOrderBlock();
        }}
      >
        Reorder block
      </button>
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  switch (leaf.type) {
    case "bold":

    default:
  }
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
    type: "default",
    children: [
      {
        text: "",
      },
    ],
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

function addMarkDown(tokens: Token[], path: Path) {
  const ranges: Range[] = [];
  let start = 0;

  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;
    if (typeof token !== "string") {
      if (token.type === "title") {
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
        type: token.type,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      });
    }

    start = end;
  }
  return ranges;
}

const getLength = (token: Token): number => {
  if (typeof token === "string") {
    return (token as string).length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else {
    return (token.content as Token[]).reduce((l, t) => l + getLength(t), 0);
  }
};

export default MarkdownPreviewExample;
