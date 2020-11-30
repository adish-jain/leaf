// @refresh reset
import { useMemo, useContext, useState, useCallback } from "react";
import slateprismStyles from "../styles/slateprism.module.scss";
import { withHistory, HistoryEditor } from "slate-history";
import Prism, { Token } from "prismjs";
import slateEditorStyles from "../styles/slate-editor.module.scss";
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
import { CodeBlockElement } from "./CodeBlockElement";
import { FilesContext } from "../contexts/files-context";
import { getPrismLanguageFromBackend } from "../lib/utils/languageUtils";

const slateNode: string = JSON.stringify([
  {
    type: "default",
    language: "javascript",
    children: [
      {
        text: "Start editing here",
      },
    ],
  },
]);

export default function SlatePrismEditor(props: {}) {
  const filesContext = useContext(FilesContext);
  const { selectedFile } = filesContext;
  if (!selectedFile) {
    return <div></div>;
  }
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const [value, setValue] = useState<Node[]>(
    JSON.parse(selectedFile?.code || slateNode)
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const decorate = useCallback((currentNodeEntry: NodeEntry) => {
    let [node, path] = currentNodeEntry;
    if (!Text.isText(node)) {
      return [];
    }
    const { language } = selectedFile;
    let prismLanguage = getPrismLanguageFromBackend(language);
    const tokens = Prism.tokenize(node.text, Prism.languages[prismLanguage]);
    return addSyntaxHighlighting(tokens as Token[], path);
  }, []);

  function handleChange(value: Node[]) {
    setValue(value);
  }

  const renderElement = useCallback((props: RenderElementProps) => {
    return <CodeBlockElement {...props} />;
  }, []);

  return (
    <div className={slateprismStyles["slateprism"]}>
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          //   renderElement={renderElement}
          //   onKeyDown={handleKeyDown}
          //   onClick={handleClick}
        />
      </Slate>
    </div>
  );
}

// different token types, styles found on Prismjs website
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const style = highlightStyle(leaf);

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

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

function highlightStyle(leaf: any) {
  let style: {
    color?: string;
    fontFamily: string;
    background?: string;
    fontStyle?: string;
    cursor?: string;
    fontWeight?:
      | "bold"
      | "-moz-initial"
      | "inherit"
      | "initial"
      | "revert"
      | "unset"
      | "normal"
      | (number & {})
      | "bolder"
      | "lighter"
      | undefined;
  } = {};
  if (leaf.bold) {
    style["fontWeight"] = "bold";
  }
  switch (leaf.prismType) {
    case "comment":
    case "prolog":
    case "doctype":
    case "cdata":
      style["color"] = "#7C7C7C";
      break;
    case "punctuation":
      style["color"] = "#c5c8c6";
      break;
    case "property":
    case "keyword":
    case "tag":
      style["color"] = "#96CBFE";
      break;
    case "class-name":
      style["color"] = "#FFFFB6";
      style["text-decoration"] = "underline";
      break;
    case "boolean":
    case "constant":
      style["color"] = "#99CC99";
      break;
    case "symbol":
    case "deleted":
      style["color"] = "#f92672";
      break;
    case "number":
      style["color"] = "#FF73FD";
      break;
    case "selector":
    case "attr-name":
    case "string":
    case "char":
    case "builtin":
    case "inserted":
      style["color"] = "#A8FF60";
      break;
    case "variable":
      style["color"] = "#C6C5FE";
      break;
    case "operator":
      style["color"] = "#EDEDED";
      break;
    case "entity":
      style["color"] = "#FFFFB6";
      style["cursor"] = "help";
      break;
    case "url":
      style["color"] = "#96CBFE";
      break;
    case "atrule":
    case "attr-value":
      style["color"] = "#F9EE98";
      break;
    case "function":
      style["color"] = "#DAD085";
      break;
    // .language-css .token.string,
    // .style .token.string {
    //   color: #87C38A;
    // }
    case "regex":
      style["color"] = "#E9C062";
      break;
    case "important":
      style["color"] = "#fd971f";
      break;
    case "prismDefault":
      style["color"] = "#c5c8c6";
      style["textShadow"] = "0 1px rgba(0, 0, 0, 0.3)";
      style["fontFamily"] =
        "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace";
      style["direction"] = "ltr";
      style["textAlign"] = "left";
      style["whiteSpace"] = "pre";
      style["wordSpacing"] = "normal";
      style["wordBreak"] = "normal";
      style["lineHeight"] = 1.5;
      style["tabSize"] = 4;
      style["hyphens"] = "none";
      break;
    default:
      style["fontFamily"] = "Arial, Helvetica, sans-serif";
      break;
  }
  if (leaf.monospace as boolean) {
    style["fontSize"] = "14px";
    style["fontFamily"] =
      "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace";
  }
  return style;
}
