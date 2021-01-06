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
  useContext,
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
import slateStyles from "../styles/slate-editor.module.scss";
import { isCollapsed } from "@udecode/slate-plugins";
import {
  formattingPaneBlockType,
  saveStatusEnum,
} from "../typescript/enums/app_enums";
import {
  FormattingPaneBlockList,
  Lines,
  WAIT_INTERVAL,
} from "../typescript/types/app_types";
import {
  handleArrowLeft,
  handleArrowRight,
  handleArrowUp,
  handleArrowDown,
  handleEnter,
  handleBackSpace,
} from "../lib/handleKeyUtils";
import { CodeBlockElement } from "./CodeBlockElement";
import {
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
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { DraftContext } from "../contexts/draft-context";
import { highlightPrismDracula } from "../lib/utils/prismUtils";
import { ToolbarContext } from "../contexts/toolbar-context";
import { MarkState } from "../lib/useToolbar";
import { motion } from "framer-motion";
import { PreviewContext } from "./preview-context";
import { toBase64 } from "../lib/imageUtils";
import { FormattingToolbar } from "./FormattingToolbar";

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

const MarkdownPreviewExample = (props: {
  slateContent: string;
  startIndex: number;
  backendId: string;
  contentType: ContentBlockType;
}) => {
  const [searchString, updateSearchString] = useState("");
  const [selectedRichTextIndex, updateSelectedRichText] = useState(0);
  let timer: NodeJS.Timeout | null = null;
  const [value, setValue] = useState<Node[]>(JSON.parse(props.slateContent));
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const { updateSlateSectionToBackend, changeEditingBlock } = useContext(
    DraftContext
  );
  const { updateSaving, updateSelectionCoordinates } = useContext(
    ToolbarContext
  );
  const { previewMode } = useContext(PreviewContext);
  const editor = useMemo(
    () =>
      withImages(
        withCodeBlockCopyPaste(withHistory(withReact(createEditor())))
      ),
    []
  );
  const { addBlock, slashPosition, updateSlashPosition } = useBlocks(editor);
  let searchedBlocks = searchBlocks(searchString, Blocks);

  // when slashposition is removed, reset the selected rich text block
  useEffect(() => {
    if (slashPosition === null) {
      updateSelectedRichText(0);
    }
  }, [slashPosition]);

  function saveValue() {}

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

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then(async (res) => {
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
      .catch((error) => {
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
      case "b": {
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
      case "i": {
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: (n) => {
            return n.italic === true;
          },
        });
        let shouldItalicize = match === undefined;
        Transforms.setNodes(
          editor,
          { italic: shouldItalicize },
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
      case "c": {
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: (n) => {
            return n.code === true;
          },
        });
        let shouldCode = match === undefined;
        Transforms.setNodes(
          editor,
          { code: shouldCode },
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

  // save to backend
  useEffect(() => {
    if (previewMode) {
      return;
    }
    const timeOutId = setTimeout(() => {
      const fetchProduct = async () => {
        try {
          updateSlateSectionToBackend(props.backendId, props.startIndex, value);
        } catch (err) {
          console.log(err);
        }
      };
      updateSaving(saveStatusEnum.saving);

      fetchProduct().then(() => {
        updateSaving(saveStatusEnum.saved);
      });
    }, WAIT_INTERVAL);
    return () => {
      clearTimeout(timeOutId);
      updateSaving(saveStatusEnum.notsaved);
    };
  }, [value]);

  function handleChange(value: Node[]) {
    if (editor.selection) {
      if (!Range.isCollapsed(editor.selection)) {
        let sel = window.getSelection();
        if (sel) {
          let myRange = sel.getRangeAt(0);
          let newDimensions = myRange.getBoundingClientRect();
          updateSelectionCoordinates(newDimensions);
        }
      } else {
        updateSelectionCoordinates(undefined);
      }
    }
    setCorrectSlashPosition();
    setValue(value);

    // let currentNodeEntry = Editor.above(editor, {
    //   match: (node) => {
    //     return Node.isNode(node);
    //   },
    // });
    const marks = Editor.marks(editor);
    let markState: MarkState = {
      italics: false,
      bold: false,
      code: false,
      link: false,
      default: false,
    };
    if (marks !== null) {
      Object.keys(marks).forEach((key) => {
        const result = marks[key];
        if (result) {
          markState[key] = true;
        }
      });
      // updateMarkType(markState);
    } else {
      markState.default = true;
      // updateMarkType(markState);
    }

    // console.log(currentNodeEntry);
  }

  function setCorrectSlashPosition() {
    if (slashPosition && editor.selection) {
      let newSlashPosition = {
        anchor: slashPosition.anchor,
        focus: editor.selection.focus,
      };
      updateSlashPosition(newSlashPosition);

      refreshSearchString(newSlashPosition);
    }
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
    updateSlashPosition(null);
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    // console.log("blurring");
    // // console.log(event.relatedTarget);
    // if (event.relatedTarget) {
    //   console.log("preventing default");
    //   // event.preventDefault();
    //   let targetId = (event.relatedTarget as HTMLDivElement).id;
    //   if (targetId !== "bar") {
    //     updateSelectionCoordinates(undefined);
    //   }
    // }
    updateSlashPosition(null);
    // let sel = window.getSelection();
    // let myRange = sel.getRangeAt(0);
    // let newDimensions = myRange.getBoundingClientRect();
    // console.log(newDimensions);
    // console.log(editor.selection);
  }

  return (
    <motion.div
      // layout
      className={slateStyles["slate-wrapper"]}
    >
      <FormattingToolbar currentEditor={editor} />
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onBlur={handleBlur}
          onFocus={(e) => {
            changeEditingBlock(props.backendId);
          }}
          onDOMBeforeInput={(event: Event) => {
            // event.preventDefault()
            console.log(event);
          }}
          readOnly={previewMode}
        />
      </Slate>
      <FormattingPane
        editor={editor}
        slashPosition={slashPosition}
        updateSlashPosition={updateSlashPosition}
        selectedRichTextIndex={selectedRichTextIndex}
        searchedBlocks={searchedBlocks}
        addBlock={addBlock}
        startIndex={props.startIndex}
        contentType={props.contentType}
      />
    </motion.div>
  );
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style = highlightPrismDracula(leaf);
  if (leaf.bold) {
    style["fontWeight"] = "bold";
  }
  if (leaf.italic) {
    style["fontStyle"] = "italic";
  }
  if (leaf.code) {
    return (
      <code className={slateStyles["code-leaf"]} {...attributes}>
        {children}
      </code>
    );
  }
  if (leaf.link) {
    return (
      <a {...attributes} href={leaf.url as string}>
        {children}
      </a>
    );
  }
  return (
    //@ts-ignore
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
            monospace: true,
            anchor: { path, offset: innerStart },
            focus: { path, offset: innerEnd },
          });
        } else {
          ranges.push({
            prismType: "prismDefault",
            monospace: true,
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
        monospace: true,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      });
    } else {
      ranges.push({
        // type: token.type,
        prismType: "prismDefault",
        monospace: true,
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

function handleTokens() {}

export default MarkdownPreviewExample;
