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
  ChangeEvent,
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
import { withHistory, HistoryEditor } from "slate-history";
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
  CodeBlockElement,
  HeaderOneElement,
  HeaderTwoElement,
  HeaderThreeElement,
  UnOrderedListElement,
  BlockQuoteElement,
  NumberedListElement,
  DefaultElement,
  ImageElement,
} from "./BlockComponents";
import { getPrismLanguageFromBackend } from "../lib/utils/languageUtils";
const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const Blocks: FormattingPaneBlockList = [
  {
    display: "Text",
    blockType: formattingPaneBlockType.P,
  },
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
  {
    display: "Ordered List",
    blockType: formattingPaneBlockType.OL,
  },
  {
    display: "Code Block",
    blockType: formattingPaneBlockType.CodeBlock,
  },
  {
    display: "Image",
    blockType: formattingPaneBlockType.Image,
  },
];

const MarkdownPreviewExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () =>
      withImages(
        withCodeBlockCopyPaste(withHistory(withReact(createEditor())))
      ),
    []
  );
  const [selectedRichTextIndex, updateSelectedRichText] = useState(0);
  const { addBlock, slashPosition, updateSlashPosition } = useBlocks(editor);
  const [searchString, updateSearchString] = useState("");
  let searchedBlocks = searchBlocks(searchString, Blocks);
  useEffect(() => {
    let retrieveValue = JSON.parse(localStorage.getItem("draftStore")!);
    if (
      (Array.isArray(retrieveValue) && retrieveValue.length === 0) ||
      retrieveValue === null
    ) {
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
      case "ol":
        return <NumberedListElement {...props} />;
      case "codeblock":
        return <CodeBlockElement changeLanguage={changeLanguage} {...props} />;
      case "image":
        return (
          <ImageElement {...props} handleImageUpload={handleImageUpload} />
        );
      case "default":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    domNode: globalThis.Node
  ) {
    let selectedImage = e.target.files![0];
    let slateNode = ReactEditor.toSlateNode(editor, domNode);
    let slatePath = ReactEditor.findPath(editor, slateNode);

    if (selectedImage.size > 5000000) {
      console.log("Image is too large");
    }
    let url = URL.createObjectURL(selectedImage);
    Transforms.setNodes(
      editor,
      {
        imageUrl: url,
      },
      {
        match: (n: Node) => {
          return Editor.isBlock(editor, n);
        },
        at: slatePath,
      }
    );
    let data = {
      requestedAPI: "saveImage",
      imageFile: await toBase64(selectedImage),
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then(async (res: any) => {
        let resJSON = await res.json();
        let newUrl = resJSON.url;

        Transforms.setNodes(
          editor,
          {
            imageUrl: newUrl,
          },
          {
            match: (n: Node) => {
              return Editor.isBlock(editor, n);
            },
            at: slatePath,
          }
        );
      })
      .catch((error: any) => {
        console.log(error);
        console.log("upload failed.");
      });
  }

  function changeLanguage(
    event: ChangeEvent<HTMLSelectElement>,
    domNode: globalThis.Node
  ) {
    let slateNode = ReactEditor.toSlateNode(editor, domNode);
    let slatePath = ReactEditor.findPath(editor, slateNode);
    let newLanguage = event.currentTarget.value;
    Transforms.setNodes(
      editor,
      {
        language: newLanguage,
      },
      {
        match: (n: Node) => {
          return Editor.isBlock(editor, n);
        },
        at: slatePath,
      }
    );
  }

  const decorate = useCallback((currentNodeEntry: NodeEntry) => {
    let [node, path] = currentNodeEntry;
    if (!Text.isText(node)) {
      return [];
    }
    let elementNodeEntry = Editor.parent(editor, path);
    let elementNode = elementNodeEntry[0];
    if (elementNode.type === "codeblock") {
      let language = elementNode.language as string;
      let prismLanguage = getPrismLanguageFromBackend(language);
      const tokens = Prism.tokenize(node.text, Prism.languages[prismLanguage]);
      return addSyntaxHighlighting(tokens as Token[], path);
    }
    return [];
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
    if (slashPosition && editor.selection) {
      let newSlashPosition = {
        anchor: slashPosition.anchor,
        focus: editor.selection.focus,
      };
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

  return (
    <div className={"slate-wrapper"}>
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Editable
          decorate={decorate}
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
  // switch (leaf.type) {
  //   case "bold":
  //     return <div {...attributes}>{children}</div>;
  // }
  let style: {
    color?: string;
    fontFamily: string;
    background?: string;
    fontStyle?: string;
    cursor?: string;
  } = {
    fontFamily: "monospace",
  };

  switch (leaf.prismType) {
    case "comment":
    case "prolog":
    case "doctype":
    case "cdata":
      style["color"] = "#93a1a1";
      break;
    case "punctuation":
      style["color"] = "#999999";
      break;
    case "property":
    case "tag":
    case "boolean":
    case "number":
    case "constant":
    case "symbol":
    case "deleted":
      style["color"] = "#990055";
      break;
    case "selector":
    case "attr-name":
    case "string":
    case "char":
    case "builtin":
    case "inserted":
      style["color"] = "#669900";
      break;
    case "operator":
    case "entity":
    case "url":
    case "string":
      style["color"] = "#a67f59";
      // style["background"] = "#ffffff";
      break;
    case "atrule":
    case "attr-value":
    case "keyword":
      style["color"] = "#0077aa";
      break;
    case "function":
      style["color"] = "#dd4a68";
      break;
    case "regex":
    case "important":
    case "variable":
      style["color"] = "#ee9900";
      break;
    case "important":
    case "bold":
      style["fontStyle"] = "bold";
      break;
    case "italic":
      style["fontStyle"] = "italic";
      break;
    case "entity":
      style["cursor"] = "help";
      break;
    case "prismDefault":
      style["fontFamily"] = "monospace";
      break;
    default:
      style["fontFamily"] = "Arial, Helvetica, sans-serif";
      break;
  }

  return (
    <span {...attributes} style={style}>
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

function addSyntaxHighlighting(tokens: Token[], path: Path) {
  const ranges: Range[] = [];
  let start = 0;

  for (const token of tokens) {
    let length = getLength(token);
    let end = start + length;
    if (Array.isArray(token.content)) {
      let innerStart = start;
      for (let i = 0; i < (token.content as Token[]).length; i++) {
        let currentToken = (token.content as Token[])[i];
        let innerLength = getLength(currentToken);
        let innerEnd = innerStart + innerLength;
        if (typeof currentToken !== "string") {
          ranges.push({
            prismType: currentToken.type,
            anchor: { path, offset: innerStart },
            focus: { path, offset: innerEnd },
          });
        } else {
          ranges.push({
            prismType: "prismDefault",
            anchor: { path, offset: innerStart },
            focus: { path, offset: innerEnd },
          });
        }

        innerStart = innerEnd;
      }
    } else if (typeof token !== "string") {
      ranges.push({
        // type: token.type,
        prismType: token.type,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      });
    } else {
      ranges.push({
        // type: token.type,
        prismType: "prismDefault",
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

const withCodeBlockCopyPaste = (
  editor: Editor & ReactEditor & HistoryEditor
) => {
  const { insertData, insertText } = editor;
  editor.insertData = (data: DataTransfer) => {
    // let selection = editor.selection;
    let currentNodeEntry = Editor.above(editor, {
      match: (node) => {
        return Node.isNode(node);
      },
    });
    if (currentNodeEntry) {
      let currentNode = currentNodeEntry[0];
      if (currentNode.type === "codeblock") {
        const plain = data.getData("text/plain");
        insertText(plain);
        return;
      }
    }
    insertData(data);
  };

  return editor;
};

const withImages = (editor: Editor & ReactEditor & HistoryEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
};

function handleTokens() {
  
}

export default MarkdownPreviewExample;
