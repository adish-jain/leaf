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

export const PublishedMarkDownSection = (props: {
  slateContent: string;
  startIndex: number;
  backendId: string;
  contentType: ContentBlockType;
}) => {
  const [searchString, updateSearchString] = useState("");
  const [value, setValue] = useState<Node[]>(JSON.parse(props.slateContent));
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
        return <CodeBlockElement {...props} />;
      case "image":
        return <ImageElement {...props} />;
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

  return (
    <motion.div
      // layout
      className={slateStyles["slate-wrapper"]}
    >
      <Slate editor={editor} value={value} onChange={() => {}}>
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          readOnly={true}
        />
      </Slate>
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

export default PublishedMarkDownSection;
