import React, { Component } from "react";
import LanguageBar from "./LanguageBar";
import FileBar from "./FileBar";
import ImageOptions from "./ImageOptions";
import codeEditorStyles from "../styles/codeeditor.module.scss";
import ImageView from "./ImageView";
import { FilesContext } from "../contexts/files-context";
import { fileObject } from "../typescript/types/frontend/postTypes";
import { DraftContext } from "../contexts/draft-context";
import { Dispatch, SetStateAction } from "react";
import SlatePrismEditor from "./SlatePrismEditor";
import { AnimatePresence, motion } from "framer-motion";
import { slateFade } from "../styles/framer_animations/opacityFade";
import { LineModal } from "./LineModal";
type CodeEditorProps = {
  inView: boolean;
};

type CodeEditorState = {};

export default function CodeEditor(props: CodeEditorProps) {
  const { inView } = props;
  return (
    <div className={codeEditorStyles["CodeEditor"]}>
      <ImageView />
      <FileBar />
      <div className={codeEditorStyles["slate-wrapper"]}>
        <AnimatePresence>
          {inView && (
            <motion.div
              initial={"hidden"}
              animate={"visible"}
              exit={"hidden"}
              variants={slateFade}
              // style={{ position: "relative" }}
            >
              <SlatePrismEditor inView={inView} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <LanguageBar />
      {/* <LineModal /> */}
    </div>
  );
}
