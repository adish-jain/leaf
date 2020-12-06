import MarkdownSection from "./MarkdownSection";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import React, {
  Component,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { DraftContext } from "../contexts/draft-context";
import stepStyles from "../styles/step.module.scss";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { LinesContext } from "../contexts/lines-context";
import { AnimatePresence, motion } from "framer-motion";

export function CodeStep(props: {
  codeStep: contentBlock;
  index: number;
  sectionIndex: number;
  selected: boolean;
  last: boolean;
  backendId: string;
}) {
  const { codeStep, index, sectionIndex, selected, last, backendId } = props;
  const [hovered, updateHovered] = useState(false);
  const draftContext = useContext(DraftContext);
  const { updateStepCoordinate } = useContext(LinesContext);
  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  const { changeEditingBlock } = draftContext;
  let style = {};

  function handleScroll() {
    const stepDim = stepRef.current?.getBoundingClientRect();
    if (!stepDim) {
      return;
    }
    if (selected) {
      updateStepCoordinate(stepDim);
    }
  }

  const selectedClass = selected ? stepStyles.selected : "";

  // if (last) {
  //   style["marginBottom"] = "50%";
  // }
  return (
    <motion.div
      layout
      className={`${stepStyles["codestep"]} ${selectedClass}`}
      style={style}
      onClick={(e) => {
        changeEditingBlock(codeStep.backendId);
      }}
      onMouseEnter={(e) => {
        updateHovered(true);
      }}
      onMouseLeave={(e) => {
        updateHovered(false);
      }}
      ref={stepRef}
    >
      <motion.div className={stepStyles["codestep-content"]} layout>
        <MarkdownSection
          slateContent={codeStep.slateContent}
          backendId={codeStep.backendId}
          sectionIndex={index + sectionIndex}
          contentType={ContentBlockType.CodeSteps}
          key={codeStep.backendId}
        />
      </motion.div>
      <AnimatePresence>{selected && <LineStatus />}</AnimatePresence>
      <SideButtons hovered={hovered} backendId={backendId} />
    </motion.div>
  );
}

function LineStatus(props: {}) {
  // const { selected } = props;
  const { currentlySelectedLines } = useContext(LinesContext);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // transition={{
      //   duration: 0.2,
      // }}
      layout
    >
      <div className={stepStyles["line-status"]}>
        <div className={stepStyles["status-content"]}>
          No lines selected | Highlight lines in the code editor.
        </div>
      </div>
    </motion.div>
  );
}

function SideButtons(props: { hovered: boolean; backendId: string }) {
  const { deleteBlock } = useContext(DraftContext);
  let { lastStep, firstStep, hovered, backendId } = props;
  return (
    <AnimatePresence>
      {hovered && (
        <motion.div
          initial={{
            opacity: 0,
            position: "relative",
            left: "-100px",
            top: "-60px",
          }}
          animate={{ opacity: 1, position: "relative", left: "-128px" }}
          exit={{
            opacity: 0,
          }}
          transition={{ duration: 0.25 }}
        >
          <div className={stepStyles["side-buttons-wrapper"]}>
            <div className={stepStyles["side-buttons"]}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBlock(backendId);
                }}
                className={stepStyles["close"]}
              >
                <span>X</span>
              </button>
              {!firstStep && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveStepUp();
                  }}
                  className={stepStyles["up"]}
                >
                  <span>↑</span>
                </button>
              )}
              {!lastStep && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveStepDown();
                  }}
                  className={stepStyles["down"]}
                >
                  <span>↓</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
