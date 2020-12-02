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
var shortId = require("shortid");
import { CodeBlockElement } from "./CodeBlockElement";
import { FilesContext } from "../contexts/files-context";
import { getPrismLanguageFromBackend } from "../lib/utils/languageUtils";
import {
  addSyntaxHighlighting,
  highlightPrismDracula,
} from "../lib/utils/prismUtils";

const slateNode: Node[] = [
  {
    type: "default",
    language: "javascript",
    children: [
      {
        text: "Start editing here",
      },
    ],
  },
];

export default function SlatePrismEditor(props: {}) {
  const filesContext = useContext(FilesContext);
  const { selectedFile, changeCode } = filesContext;
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [
    selectedFile?.language,
  ]);

  const [value, setValue] = useState<Node[]>(selectedFile?.code || slateNode);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const decorate = useCallback(
    (currentNodeEntry: NodeEntry) => {
      let [node, path] = currentNodeEntry;
      if (!Text.isText(node)) {
        return [];
      }
      const language = selectedFile?.language || "plaintext";
      let prismLanguage = getPrismLanguageFromBackend(language);
      const tokens = Prism.tokenize(node.text, Prism.languages[prismLanguage]);
      return addSyntaxHighlighting(tokens as Token[], path);
    },
    [selectedFile?.language]
  );

  function handleChange(value: Node[]) {
    // update in top state
    // changeCode(value);
    setValue(value);
    // changeCode(JSON.parse(JSON.stringify(value)));
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
          spellCheck={false}
          readOnly={!selectedFile}
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
  const style = highlightPrismDracula(leaf);

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};
