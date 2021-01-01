import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { ToolbarContext } from "../contexts/toolbar-context";
import { toggleMark } from "../lib/useToolbar";
import formattingToolbarStyles from "../styles/formattingtoolbar.module.scss";
import { saveStatusEnum, slateMarkTypes } from "../typescript/enums/app_enums";
import {
  boldSelection,
  italicizeSelection,
  codeSelection,
} from "../lib/useToolbar";
import { ReactEditor, useEditor } from "slate-react";
import { Range } from "slate";

export function FormattingToolbar(props: { currentEditor: ReactEditor }) {
  const { currentEditor } = props;
  const toolbarContext = useContext(ToolbarContext);
  const { saveState, currentMarkType } = toolbarContext;
  let style = {};
  if (currentEditor.selection && !Range.isCollapsed(currentEditor.selection)) {
    let sel = window.getSelection();
    if (sel) {
      let myRange = sel.getRangeAt(0);
      let newDimensions = myRange.getBoundingClientRect();
      style = {
        position: "absolute",
        top: window.pageYOffset + newDimensions.y - 34,
        left: newDimensions.x,
      };
    }
  }

  return (
    // <div className={formattingToolbarStyles["formatting-toolbar"]}>
    //   <div className={formattingToolbarStyles["buttons"]}>
    //     {/* <MarkButton name={"T"} markType={slateMarkTypes.unstyled} /> */}
    //     <MarkButton name={"B"} markType={slateMarkTypes.bold} />
    //     <MarkButton name={"I"} markType={slateMarkTypes.italic} />
    //     <MarkButton name={"<>"} markType={slateMarkTypes.code} />
    //   </div>
    //   <SaveStatus saveState={saveState} />
    // </div>
    <AnimatePresence>
      {currentEditor.selection && !Range.isCollapsed(currentEditor.selection) && (
        <motion.div
          style={style}
          className={formattingToolbarStyles["hovered-toolbar"]}
          initial={{ opacity: 0, transform: "scale(0.9)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          exit={{ opacity: 0, transform: "scale(0.9)" }}
          transition={{
            duration: 0.15,
          }}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <button
            className={formattingToolbarStyles["bold-button"]}
            onClick={(e) => {
              e.preventDefault();
              boldSelection(currentEditor);
            }}
          >
            Bold
          </button>
          <button
            className={formattingToolbarStyles["italic-button"]}
            onClick={(e) => {
              e.preventDefault();
              italicizeSelection(currentEditor);
            }}
          >
            Italics
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              codeSelection(currentEditor);
            }}
            className={formattingToolbarStyles["code-button"]}
          >
            Code
          </button>
          <button className={formattingToolbarStyles["link-button"]}>
            Link
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MarkButton(props: { name: string; markType: slateMarkTypes }) {
  const toolbarContext = useContext(ToolbarContext);
  const { currentMarkType } = toolbarContext;
  const selected = currentMarkType[props.markType as string];
  let style = {};
  if (selected) {
    //@ts-ignore
    style["color"] = "blue";
  }
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        // toggleMark();
      }}
      className={formattingToolbarStyles["mark-button"]}
      style={style}
    >
      {props.name}
    </div>
  );
}

function SaveStatus(props: { saveState: saveStatusEnum }) {
  const toolbarContext = useContext(ToolbarContext);
  const { saveState } = toolbarContext;
  return (
    <div className={formattingToolbarStyles["save-state"]}> {saveState}</div>
  );
}
