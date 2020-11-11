import { motion, AnimatePresence } from "framer-motion";
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
  Ancestor,
} from "slate";
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
import { HistoryEditor } from "slate-history";
import "../styles/formattingpane.scss";
import { isAncestor } from "@udecode/slate-plugins";
import { blockType } from "../typescript/enums/app_enums";

export default function FormattingPane(props: {
  editor: Editor & ReactEditor & HistoryEditor;
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>;
  slashPosition: Range | null;
  selectedRichTextIndex: number;
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>;
  Blocks: { display: string; blockType: blockType }[];
  addBlock: (blockType: blockType) => void;
}) {
  let {
    slashPosition,
    editor,
    selectedRichTextIndex,
    updateSlashPosition,
    Blocks,
    addBlock,
  } = props;

  // find position to place formatting pane
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => Node.isNode(node),
  });
  let top: number = 0;
  if (slashPosition && currentNodeEntry && editor.selection) {
    let currentNode = currentNodeEntry[0];
    let domNode = ReactEditor.toDOMNode(editor, currentNode);
    let domNodeDimensions = domNode.getBoundingClientRect();
    top = domNodeDimensions.bottom;
    console.log(domNodeDimensions);
    // console.log(top);
    // console.log(window.innerHeight);
    if (top > window.innerHeight / 2) {
      console.log("adjusting");
      top = top - 240 - domNodeDimensions.height;
      console.log(top + window.pageYOffset);
    }
    let nodeFragment = Node.fragment(currentNode, slashPosition);
    // let nodeString = Node.string(nodeFragment[0]);
    // console.log(nodeString);
  }

  return (
    <AnimatePresence>
      {slashPosition && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 1,
            top: top + window.pageYOffset,
            transformOrigin: "top left",
          }}
          initial={{
            opacity: 0,
            transform: "scale(0.9)",
          }}
          animate={{
            opacity: 1,
            transform: "scale(1)",
          }}
          exit={{
            opacity: 0,
            transform: "scale(0.9)",
          }}
          transition={{
            duration: 0.15,
          }}
        >
          <div className={"formatting-pane"}>
            <div className={"rich-text"}>
              <div className={"section-label"}>Rich Text</div>
              {Blocks.map((block, index) => {
                return (
                  <RichTextElement
                    elementName={block.display}
                    blockType={block.blockType}
                    key={index}
                    selected={index === selectedRichTextIndex}
                    addBlock={addBlock}
                  />
                );
              })}
              <div>Numbered List</div>
              <div>Blockquote</div>
              <div>Code Block</div>
              <div>Image</div>
            </div>
            <div>
              <label className={"section-label"}>Interactivity</label>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RichTextElement(props: {
  elementName: string;
  blockType: blockType;
  selected: boolean;
  addBlock: (blockType: blockType) => void;
}) {
  let { elementName, blockType, selected, addBlock } = props;
  let style = selected ? { backgroundColor: "#edece9" } : {};
  return (
    <div
      className={"rich-text-element"}
      onClick={(e) => {
        addBlock(blockType);
      }}
      style={style}
    >
      <div className={"element-img"}></div>
      <label className={"rich-text-label"}>{elementName}</label>
    </div>
  );
}
