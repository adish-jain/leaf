import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ToolbarContext } from "../contexts/toolbar-context";
import { toggleMark } from "../lib/useToolbar";
import formattingToolbarStyles from "../styles/formattingtoolbar.module.scss";
import { saveStatusEnum, slateMarkTypes } from "../typescript/enums/app_enums";
import {
  boldSelection,
  italicizeSelection,
  codeSelection,
  linkWrapSelection,
} from "../lib/useToolbar";
import { ReactEditor, useEditor } from "slate-react";
import { Range } from "slate";
const shortId = require("shortid");

export function FormattingToolbar(props: {}) {
  const currentEditor = useEditor();
  const [showLink, updateShowLink] = useState(false);
  const {
    updateLinkSelection,
    saveState,
    currentMarkType,
    selectionCoordinates,
  } = useContext(ToolbarContext);
  let style = {};

  useEffect(() => {
    if (selectionCoordinates === undefined) {
      updateShowLink(false);
    } else {
      if (currentEditor.selection) {
        updateLinkSelection(currentEditor.selection);
      }
    }
  }, [selectionCoordinates]);
  if (selectionCoordinates) {
    style = {
      position: "absolute",
      top: window.pageYOffset + selectionCoordinates.y - 34,
      left: selectionCoordinates.x,
    };
  }

  return (
    <div>
      <LinkToolbar showLink={showLink} />
      <AnimatePresence>
        {selectionCoordinates && (
          <motion.div
            style={style}
            className={formattingToolbarStyles["hovered-toolbar"]}
            initial={{ opacity: 0, transform: "scale(0.9)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            exit={{ opacity: 0, transform: "scale(0.9)" }}
            transition={{
              duration: 0.15,
            }}
            // key={shortId.generate()}
            id={"bar"}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className={"formatting-buttons"}>
              <button
                id={"bar"}
                className={formattingToolbarStyles["bold-button"]}
                onClick={(e) => {
                  console.log("current editor is ");
                  console.log(currentEditor.selection);
                  e.preventDefault();
                  boldSelection(currentEditor);
                }}
              >
                Bold
              </button>
              <button
                id={"bar"}
                className={formattingToolbarStyles["italic-button"]}
                onClick={(e) => {
                  e.preventDefault();
                  italicizeSelection(currentEditor);
                }}
              >
                Italics
              </button>
              <button
                id={"bar"}
                className={formattingToolbarStyles["code-button"]}
                onClick={(e) => {
                  e.preventDefault();
                  codeSelection(currentEditor);
                }}
              >
                Code
              </button>
              <button
                id={"bar"}
                className={formattingToolbarStyles["link-button"]}
                onClick={(e) => {
                  e.preventDefault();
                  updateShowLink(true);
                }}
              >
                Link
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FakeSelection(props: { showLink: boolean }) {
  const { showLink } = props;
  const { selectionCoordinates } = useContext(ToolbarContext);
  return (
    <AnimatePresence>
      {selectionCoordinates && showLink && (
        <motion.div
          style={{
            top: selectionCoordinates.top,
            left: selectionCoordinates.x,
            width: selectionCoordinates.width,
            position: "absolute",
            height: selectionCoordinates.height,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0,
          }}
          className={formattingToolbarStyles["fake-selection"]}
        ></motion.div>
      )}
    </AnimatePresence>
  );
}

function LinkToolbar(props: { showLink: boolean }) {
  const {
    saveState,
    currentMarkType,
    selectionCoordinates,
    linkSelection,
  } = useContext(ToolbarContext);
  const [linkValue, setLinkValue] = useState("");
  useEffect(() => {
    if (selectionCoordinates === undefined) {
      setLinkValue("");
    }
  }, [selectionCoordinates]);
  const currentEditor = useEditor();
  const { showLink } = props;
  return (
    <div>
      {/* <FakeSelection showLink={showLink} /> */}
      <AnimatePresence>
        {showLink && selectionCoordinates && (
          <motion.div
            className={formattingToolbarStyles["link-input"]}
            style={{
              position: "absolute",
              top: window.pageYOffset + selectionCoordinates!.y + 34,
              left: selectionCoordinates!.x,
            }}
            initial={{ opacity: 0, transform: "scale(0.9)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            exit={{ opacity: 0, transform: "scale(0.9)" }}
            transition={{
              duration: 0.15,
            }}
          >
            <input
              value={linkValue}
              id={"bar"}
              onChange={(e) => {
                setLinkValue(e.target.value);
              }}
              placeholder={"Enter link here"}
              onFocus={(e) => {}}
            />
            {linkSelection && (
              <button
                onClick={(e) => {
                  linkWrapSelection(currentEditor, linkValue, linkSelection);
                }}
              >
                Add link
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
