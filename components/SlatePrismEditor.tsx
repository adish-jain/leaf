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
import { Lines } from "../typescript/types/frontend/postTypes";
import { LineModal } from "./LineModal";
import { DraftContext } from "../contexts/draft-context";
import { AnimatePresence, motion } from "framer-motion";
import { opacityFade } from "../styles/framer_animations/opacityFade";

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

export default function SlatePrismEditor(props: { inView: boolean }) {
  const { inView } = props;
  const { selectedFile, changeCode } = useContext(FilesContext);
  const { currentlySelectedLines, changeSelectedLines } = useContext(
    LinesContext
  );
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

  // clear selected lines on unmount
  useEffect(() => {
    return () => {
      changeSelectedLines(undefined);
    };
  }, []);

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
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
      const selectionLines = selectionToLines(editor.selection);
      let sel = window.getSelection();
      if (sel) {
        let myRange = sel.getRangeAt(0);
        let newDimensions = myRange.getBoundingClientRect();
      }
      changeSelectedLines(selectionLines);
    } else {
      changeSelectedLines(undefined);
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
        <Slate
          editor={editor}
          value={value}
          onChange={handleChange}
          // onBlur={changeSelectedLines(undefined)}
        >
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
      <EditorCodeBlockLines
        numOfLines={value.length}
        height={slateHeight}
        inView={inView}
      />
    </div>
  );
}

// different token types, styles found on Prismjs website
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const style = highlightPrismDracula(leaf);

  return (
    //@ts-ignore
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

export function EditorCodeBlockLines(props: {
  numOfLines: number;
  height: number;
  inView: boolean;
}) {
  const { height, numOfLines, inView } = props;
  const { currentlyEditingBlock } = useContext(DraftContext);
  const { selectedFile } = useContext(FilesContext);
  const lines = currentlyEditingBlock?.lines;
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
        <AnimatePresence>
          {currentlyEditingBlock?.fileId === selectedFile?.fileId &&
            lines &&
            inView &&
            i + 1 >= lines?.start &&
            i + 1 <= lines?.end && (
              <motion.div
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 0.2, width: "100%" }}
                exit={{ opacity: 0, width: "0%" }}
                variants={opacityFade}
                style={{
                  height: height / numOfLines,
                }}
                className={slateprismStyles["highlight"]}
              ></motion.div>
            )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div contentEditable={false} className={slateprismStyles["codelines"]}>
      {toRender}
    </div>
  );
}

function selectionToLines(currentSelection: Range): Lines {
  const anchorLine = currentSelection.anchor.path[0];
  const focusLine = currentSelection.focus.path[0];
  const start = Math.min(anchorLine, focusLine);
  const end = Math.max(anchorLine, focusLine);
  return {
    start: start + 1,
    end: end + 1,
  };
}
