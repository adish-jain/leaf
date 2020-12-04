// @refresh reset
import {
  useMemo,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import slateprismStyles from "../styles/slateprism.module.scss";
import { withHistory, HistoryEditor } from "slate-history";
import Prism, { Token } from "prismjs";
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
import { LinesContext } from "../contexts/lines-context";

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
  const { selectedFile, changeCode } = useContext(FilesContext);
  const {
    currentlySelectedLines,
    changeSelectedLines,
    updateSelectionCoordinates,
    selectionCoordinates,
  } = useContext(LinesContext);
  const slateRef = useRef<HTMLDivElement>(null);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [
    selectedFile?.language,
  ]);
  const [slateHeight, updateHeight] = useState(0);
  const [value, setValue] = useState<Node[]>(selectedFile?.code || slateNode);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useEffect(() => {
    updateHeight(slateRef.current!.clientHeight);
  }, [value]);

  useEffect(() => {
    setValue(selectedFile?.code || slateNode);
  }, [selectedFile?.fileId]);

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
    [selectedFile?.language, selectedFile?.fileId]
  );

  function handleChange(value: Node[]) {
    console.log(editor.selection);
    let sel = window.getSelection();
    if (sel) {
      let myRange = sel.getRangeAt(0);
      let newDimensions = myRange.getBoundingClientRect();
      // updateSelectionCoordinates(newDimensions);
    }
    // update in top state
    changeCode(value);
    // update in local state
    setValue(value);
    // changeCode(JSON.parse(JSON.stringify(value)));
  }

  const renderElement = useCallback((props: RenderElementProps) => {
    return <CodeBlockElement {...props} />;
  }, []);
  return (
    <div className={slateprismStyles["slateprism"]}>
      <div ref={slateRef}>
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
      <EditorCodeBlockLines numOfLines={value.length} height={slateHeight} />
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

export function EditorCodeBlockLines(props: {
  numOfLines: number;
  height: number;
}) {
  const { height, numOfLines } = props;

  const toRender = [];
  for (let i = 0; i < props.numOfLines; i++) {
    toRender.push(
      <div
        key={i}
        style={{
          height: height / numOfLines,
        }}
        className={slateprismStyles["codeline"]}
      >
        {i + 1}
      </div>
    );
  }
  return (
    <div contentEditable={false} className={slateprismStyles["codelines"]}>
      {toRender}
    </div>
  );
}
