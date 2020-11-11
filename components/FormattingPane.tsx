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
import React, { useRef, useEffect, useState } from "react";

import { HistoryEditor } from "slate-history";
import "../styles/formattingpane.scss";
import { isAncestor } from "@udecode/slate-plugins";
import { blockType } from "../typescript/enums/app_enums";

let leftPos = 0;
export default function FormattingPane(props: {
  editor: Editor & ReactEditor & HistoryEditor;
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>;
  slashPosition: Range | null;
  selectedRichTextIndex: number;
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>;
  Blocks: { display: string; blockType: blockType }[];
  addBlock: (blockType: blockType) => void;
}) {
  const formattingPaneRef = useRef<HTMLDivElement>(null);
  let {
    slashPosition,
    editor,
    selectedRichTextIndex,
    updateSlashPosition,
    Blocks,
    addBlock,
  } = props;

  if (!slashPosition) {
    leftPos = 0;
  }
  // find position to place formatting pane
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => Node.isNode(node),
  });
  let top: number = 0;
  let transformOrigin = "top left";
  if (slashPosition && currentNodeEntry && editor.selection) {
    let currentNode = currentNodeEntry[0];
    let sel = window.getSelection();
    if (sel) {
      let myRange = sel.getRangeAt(0);
      let newDimensions = myRange.getBoundingClientRect();
      // set leftpos at slash position
      if (leftPos === 0) {
        let newLeft = newDimensions.x;
        leftPos = newLeft;
      }
      // set proper top position, depending on whether selection
      // is in bottom or top half of viewport
      top = newDimensions.bottom;
      if (top + 240 > window.innerHeight) {
        top = top - 240 - newDimensions.height;
        transformOrigin = "bottom left";
      }
    }
  } else {
  }

  return (
    <AnimatePresence>
      {slashPosition && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 1,
            top: top + window.pageYOffset,
            transformOrigin: transformOrigin,
            left: leftPos,
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
          <div ref={formattingPaneRef} className={"formatting-pane"}>
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
  const richTextElementRef = useRef<HTMLDivElement>(null);

  let { elementName, blockType, selected, addBlock } = props;

  let style = selected ? { backgroundColor: "#edece9" } : {};

  function scrollPane() {}

  return (
    <div
      className={"rich-text-element"}
      onClick={(e) => {
        addBlock(blockType);
      }}
      style={style}
      ref={richTextElementRef}
    >
      <div className={"element-img"}></div>
      <label className={"rich-text-label"}>{elementName}</label>
    </div>
  );
}
