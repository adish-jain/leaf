// @refresh reset

import Prism, { Token } from "prismjs";
import FormattingPane from "./FormattingPane";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactElement,
  useRef,
} from "react";
import { useBlocks } from "../lib/blockUtils";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  useSelected,
  useFocused,
  RenderLeafProps,
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
import { motion, AnimatePresence } from "framer-motion";
import { blockType } from "../typescript/enums/app_enums";
const Blocks = [
  {
    display: "Header 1",
    blockType: blockType.H1,
  },
  {
    display: "Header 2",
    blockType: blockType.H2,
  },
  {
    display: "Header 3",
    blockType: blockType.H3,
  },
  {
    display: "Bulleted List",
    blockType: blockType.UL,
  },
];

const MarkdownPreviewExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [selectedRichTextIndex, updateSelectedRichText] = useState(0);
  const { addBlock, slashPosition, updateSlashPosition } = useBlocks(editor);

  useEffect(() => {
    let retrieveValue = JSON.parse(localStorage.getItem("draftStore")!);
    if (Array.isArray(retrieveValue) && retrieveValue.length === 0) {
      retrieveValue = initialValue;
    }
    setValue(retrieveValue);
  }, [process.browser]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  function handleKey(this: Window, ev: KeyboardEvent) {}

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "h1":
        return <HeaderOneElement {...props} />;
      case "h2":
        return <HeaderTwoElement {...props} />;
      case "h3":
        return <HeaderThreeElement {...props} />;
      case "ul":
        return <UnOrderedListElement {...props} />;
      case "default":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const decorate = useCallback((currentNodeEntry: NodeEntry) => {
    let [node, path] = currentNodeEntry;

    if (!Text.isText(node)) {
      return [];
    }
    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    return addMarkDown(tokens as Token[], path);
  }, []);

  function reOrderBlock() {
    Transforms.moveNodes(editor, { at: [1], to: [3] });
  }

  function handleCommandKey(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "b":
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: (n) => {
            return n.bold === true;
          },
        });
        let shouldBold = match === undefined;
        Transforms.setNodes(
          editor,
          { bold: shouldBold },
          // Apply it to text nodes, and split the text node up if the
          // selection is overlapping only part of it.
          {
            match: (n) => {
              return Text.isText(n);
            },
            split: true,
          }
        );
        break;
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // if (editor.selection && Range.isBackward(editor.selection)) {
    // }
    if (event.metaKey) {
      handleCommandKey(event);
    }
    // expand or contract slash positioning
    if (slashPosition) {
      let newSlashPosition = {
        anchor: slashPosition.anchor,
        focus: editor.selection!.anchor,
      };
      updateSlashPosition(newSlashPosition);
    }
    switch (event.key) {
      case "/":
        if (!slashPosition) {
          event.preventDefault();
          editor.insertText("/");
          updateSlashPosition(editor.selection!);
        }
        break;
      case "ArrowDown":
        return handleArrowDown(event);
      case "ArrowUp":
        return handleArrowUp(event);
      case "ArrowLeft":
        return handleArrowLeft(event);
      case "ArrowRight":
        return handleArrowRight(event);
      case "Backspace":
        return handleBackSpace(event);
      case "Escape":
        if (slashPosition) {
          event.preventDefault();
          updateSlashPosition(null);
        }
        break;
      case "Enter":
        return handleEnter(event);
    }
  }

  function handleChange(value: Node[]) {
    let stringifyValue = JSON.stringify(value);
    localStorage.setItem("draftStore", stringifyValue);
    setValue(value);
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
    let emptyText = props.element.children[0].text === "";
    const [hovered, toggleHover] = useState(false);
    // const defaultElementRef = useRef<HTMLDivElement>(null);
    // if (hovered && defaultElementRef) {
    //   let dimensions = defaultElementRef.current?.getBoundingClientRect();
    //   updateBlockHandleState({
    //     hovered: true,
    //     yPos: dimensions?.y || 0,
    //     xPos: dimensions?.x || 0,
    //   });
    // }
    return (
      <div
        className={"prompt"}
        onMouseLeave={(e) => toggleHover(false)}
        onMouseEnter={(e) => toggleHover(true)}
        // ref={defaultElementRef}
      >
        <span className={"prompt-content"} {...props.attributes}>
          {props.children}
        </span>
        {focused && selected && emptyText && (
          <label
            contentEditable={false}
            // onClick={(e) => e.preventDefault()}
            className={"placeholder-text"}
          >
            {"Press '/' for commands"}
          </label>
        )}
        <BlockHandle hovered={hovered} />
      </div>
    );
  };

  return (
    <div className={"slate-wrapper"}>
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Editable
          // decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        />
      </Slate>
      <FormattingPane
        editor={editor}
        slashPosition={slashPosition}
        updateSlashPosition={updateSlashPosition}
        selectedRichTextIndex={selectedRichTextIndex}
        updateSelectedRichText={updateSelectedRichText}
        Blocks={Blocks}
        addBlock={addBlock}
      />
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  switch (leaf.type) {
    case "bold":
      console.log("bold");
      return <div {...attributes}>{children}</div>;
    // case "slashCapture":
    //   return (
    //     <span {...attributes} style={{ color: "red" }}>
    //       {children}
    //     </span>
    //   );
    case "h1":
      return (
        <h1
          style={{
            display: "inline-block",
          }}
          {...attributes}
        >
          {children}
        </h1>
      );
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

const initialValue: Node[] = [
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

// Define a React component renderer for h1 blocks.
const HeaderOneElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"headerOne"}>
      <h1 {...props.attributes}>{props.children}</h1>
      {empty && <HeadingPlaceHolder>Heading 1</HeadingPlaceHolder>}
    </div>
  );
};

function HeadingPlaceHolder(props: any) {
  return (
    <label contentEditable={false} onClick={(e) => e.preventDefault()}>
      {props.children}
    </label>
  );
}

// Define a React component renderer for h2 blocks.
const HeaderTwoElement = (props: any) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"headerTwo"}>
      <h2 {...props.attributes}>{props.children}</h2>
      {empty && <HeadingPlaceHolder>Heading 2</HeadingPlaceHolder>}
    </div>
  );
};

// Define a React component renderer for h2 blocks.
const HeaderThreeElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";

  return (
    <div className={"headerThree"}>
      <h3 {...props.attributes}>{props.children}</h3>
      {empty && <HeadingPlaceHolder>Heading 3</HeadingPlaceHolder>}
    </div>
  );
};

const UnOrderedListElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"unordered-list"}>
      <div {...props.attributes}>{props.children}</div>
      {empty && <HeadingPlaceHolder>List</HeadingPlaceHolder>}
    </div>
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

const BlockHandle = (props: {
  hovered: boolean;
  // yPos: number;
  // xPos: number;
}) => {
  let {
    hovered,
    // yPos,
    // xPos
  } = props;

  return (
    <AnimatePresence>
      {hovered && (
        <motion.div
          style={{
            position: "absolute",
            top: "-2px",
            left: "4px",
            // bottom: 0,
            // top: `${yPos + window.pageYOffset - 26}px`,
            // left: `${xPos + window.pageXOffset - 4}px`,
            zIndex: 3,
            cursor: "pointer",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
          }}
        >
          <div
            // onClick={(e) => e.preventDefault()}
            contentEditable={false}
            className={"handle"}
            draggable={true}
          >
            <img src="/images/sixdots.svg" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MarkdownPreviewExample;
