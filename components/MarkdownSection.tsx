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
import { useBlocks, searchBlocks } from "../lib/blockUtils";
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
import { formattingPaneBlockType } from "../typescript/enums/app_enums";
import { FormattingPaneBlockList } from "../typescript/types/app_types";
import {
  handleArrowLeft,
  handleArrowRight,
  handleArrowUp,
  handleArrowDown,
  handleEnter,
  handleBackSpace,
} from "../lib/handleKeyUtils";
import {
  CodeElement,
  HeaderOneElement,
  HeaderTwoElement,
  HeaderThreeElement,
  UnOrderedListElement,
  BlockQuoteElement,
} from "./BlockComponents";
const Blocks: FormattingPaneBlockList = [
  {
    display: "Header 1",
    blockType: formattingPaneBlockType.H1,
  },
  {
    display: "Header 2",
    blockType: formattingPaneBlockType.H2,
  },
  {
    display: "Header 3",
    blockType: formattingPaneBlockType.H3,
  },
  {
    display: "Bulleted List",
    blockType: formattingPaneBlockType.UL,
  },
  {
    display: "Block Quote",
    blockType: formattingPaneBlockType.Blockquote,
  },
];

const MarkdownPreviewExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [selectedRichTextIndex, updateSelectedRichText] = useState(0);
  const { addBlock, slashPosition, updateSlashPosition } = useBlocks(editor);
  const [searchString, updateSearchString] = useState("");
  let searchedBlocks = searchBlocks(searchString, Blocks);
  useEffect(() => {
    let retrieveValue = JSON.parse(localStorage.getItem("draftStore")!);
    if (Array.isArray(retrieveValue) && retrieveValue.length === 0) {
      retrieveValue = initialValue;
    }
    setValue(retrieveValue);
  }, [process.browser]);

  useEffect(() => {
    if (slashPosition === null) {
      updateSelectedRichText(0);
    }
  }, [slashPosition]);

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
      case "blockquote":
        return <BlockQuoteElement {...props} />;
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

  // function handleSearchString() {}

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // if (editor.selection && Range.isBackward(editor.selection)) {
    // }
    if (event.metaKey) {
      handleCommandKey(event);
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
        return handleArrowDown(
          event,
          selectedRichTextIndex,
          slashPosition,
          updateSelectedRichText,
          searchedBlocks.length
        );
      case "ArrowUp":
        return handleArrowUp(
          event,
          selectedRichTextIndex,
          slashPosition,
          updateSelectedRichText,
          searchedBlocks.length
        );
      case "ArrowLeft":
        return handleArrowLeft(event, slashPosition, updateSlashPosition);
      case "ArrowRight":
        return handleArrowRight(event, slashPosition);
      case "Backspace":
        return handleBackSpace(
          event,
          slashPosition,
          editor,
          updateSlashPosition
        );
      case "Escape":
        if (slashPosition) {
          event.preventDefault();
          updateSlashPosition(null);
        }
        break;
      case "Enter":
        return handleEnter(
          event,
          editor,
          slashPosition,
          addBlock,
          searchedBlocks,
          selectedRichTextIndex
        );
    }
  }

  function handleChange(value: Node[]) {
    // expand or contract slash positioning
    if (slashPosition) {
      let newSlashPosition = {
        anchor: slashPosition.anchor,
        focus: editor.selection!.focus,
      };
      if (Range.isCollapsed(newSlashPosition)) {
        // console.log("collapsed");
        // updateSlashPosition(null);
      } else {
      }
      updateSlashPosition(newSlashPosition);

      refreshSearchString(newSlashPosition);
    }

    let stringifyValue = JSON.stringify(value);
    localStorage.setItem("draftStore", stringifyValue);
    setValue(value);
  }

  function refreshSearchString(newSlashPosition: Range) {
    let searchString = Editor.string(editor, newSlashPosition);
    if (searchString.length > 16) {
      updateSlashPosition(null);
    } else {
      console.log(searchString);
      updateSearchString(searchString);
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
    }
  }

  const DefaultElement = (props: RenderElementProps) => {
    const selected = useSelected();
    const focused = useFocused();
    let emptyText = props.element.children[0].text === "";
    const [hovered, toggleHover] = useState(false);
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
        searchedBlocks={searchedBlocks}
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
