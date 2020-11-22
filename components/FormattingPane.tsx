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
import { searchBlocks } from "../lib/blockUtils";
import { HistoryEditor } from "slate-history";
import "../styles/formattingpane.scss";
import { isAncestor } from "@udecode/slate-plugins";
import { formattingPaneBlockType } from "../typescript/enums/app_enums";
import { FormattingPaneBlockList } from "../typescript/types/app_types";
let leftPos = 0;
export default function FormattingPane(props: {
  editor: Editor & ReactEditor & HistoryEditor;
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>;
  slashPosition: Range | null;
  selectedRichTextIndex: number;
  searchedBlocks: FormattingPaneBlockList;
  addBlock: (blockType: formattingPaneBlockType) => void;
}) {
  const formattingPaneRef = useRef<HTMLDivElement>(null);
  let formattingPaneHeight = 240;
  let {
    slashPosition,
    editor,
    selectedRichTextIndex,
    updateSlashPosition,
    searchedBlocks,
    addBlock,
  } = props;

  if (!slashPosition) {
    leftPos = 0;
  }
  // find position to place formatting pane
  let top: number = 0;
  let transformOrigin = "top left";
  let searchString = "";
  if (slashPosition) {
    let newAfter =
      Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
    let fullRange: Range = {
      anchor: slashPosition.anchor,
      focus: newAfter,
    };

    searchString = Editor.string(editor, fullRange);

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
      if (window.innerHeight < 350) {
        formattingPaneHeight = 120;
      }
      top = newDimensions.bottom;
      if (top + formattingPaneHeight > window.innerHeight) {
        top = top - formattingPaneHeight - newDimensions.height;
        transformOrigin = "bottom left";
      }
    }
  }
  // let searchedBlocks = searchBlocks(slashPosition, editor, Blocks);

  return (
    <AnimatePresence>
      {slashPosition && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 10,
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
          <div
            ref={formattingPaneRef}
            className={"formatting-pane"}
            style={{ height: `${formattingPaneHeight}px` }}
          >
            <div className={"rich-text"}>
              <div className={"section-label"}>Rich Text</div>
              {searchedBlocks.map((block, index) => {
                {
                  return (
                    <RichTextElement
                      elementName={block.display}
                      blockType={block.blockType}
                      key={block.display}
                      selected={index === selectedRichTextIndex}
                      addBlock={addBlock}
                    />
                  );
                }
              })}
            </div>
            <div className={"rich-text"}>
              <div className={"section-label"}>Interactivity</div>
              <InteractiveElement elementName={"Code Steps"} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InteractiveElement(props: { elementName: string }) {
  return <div className={"interactive-element"}>{props.elementName}</div>;
}

function RichTextElement(props: {
  elementName: string;
  blockType: formattingPaneBlockType;
  selected: boolean;
  addBlock: (blockType: formattingPaneBlockType) => void;
}) {
  const richTextElementRef = useRef<HTMLDivElement>(null);
  const [hovered, toggleHovered] = useState(false);
  let { elementName, blockType, selected, addBlock } = props;

  let style = selected || hovered ? { backgroundColor: "#edece9" } : {};

  useEffect(() => {
    if (selected) {
      // richTextElementRef.current?.scrollIntoView(false);
      richTextElementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        // inline: "start",
      });
    }
  }, [selected]);

  return (
    <div
      className={"rich-text-element"}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        addBlock(blockType);
      }}
      style={style}
      ref={richTextElementRef}
      onMouseEnter={(e) => toggleHovered(true)}
      onMouseLeave={(e) => toggleHovered(false)}
    >
      <div className={"element-img"}></div>
      <label className={"rich-text-label"}>{elementName}</label>
    </div>
  );
}
