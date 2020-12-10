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
import { opacityFade } from "../styles/framer_animations/opacityFade";
import { LineStatus } from "./LineStatus";
import { FilesContext } from "../contexts/files-context";
export function CodeStep(props: {
  codeStep: contentBlock;
  index: number;
  startIndex: number;
  selected: boolean;
  last: boolean;
  backendId: string;
}) {
  const { codeStep, index, startIndex, selected, last, backendId } = props;
  const [hovered, updateHovered] = useState(false);
  const { changeEditingBlock } = useContext(DraftContext);
  const { updateStepCoordinate } = useContext(LinesContext);
  const { changeSelectedFileIndex, files } = useContext(FilesContext);
  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // window.addEventListener("scroll", handleScroll);
    return () => {
      // window.removeEventListener("scroll", handleScroll);
    };
  });
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

  function changeFile() {
    const fileId = codeStep.fileId;
    if (!fileId) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (files[i].fileId === fileId) {
        changeSelectedFileIndex(i);
        break;
      }
    }
  }

  const selectedClass = selected ? stepStyles.selected : "";
  // if (last) {
  //   style["marginBottom"] = "50%";
  // }
  return (
    <div
    // style={{ position: "relative" }}
    >
      <SideButtons
        firstStep={index === 0}
        hovered={hovered}
        backendId={backendId}
        updateHovered={updateHovered}
      />
      <motion.div
        // layout
        className={`${stepStyles["codestep"]} ${selectedClass}`}
        style={style}
        onClick={(e) => {
          changeEditingBlock(codeStep.backendId);
          changeFile();
        }}
        onMouseEnter={(e) => {
          updateHovered(true);
        }}
        onMouseLeave={(e) => {
          updateHovered(false);
        }}
        ref={stepRef}
      >
        <motion.div
          className={stepStyles["codestep-content"]}
          // layout
        >
          <MarkdownSection
            slateContent={codeStep.slateContent}
            backendId={codeStep.backendId}
            startIndex={index + startIndex}
            contentType={ContentBlockType.CodeSteps}
            key={codeStep.backendId}
          />
        </motion.div>
        <LineStatus
          selected={selected}
          backendId={backendId}
          lines={codeStep.lines}
          fileId={codeStep.fileId}
        />
      </motion.div>
    </div>
  );
}

function SideButtons(props: {
  hovered: boolean;
  backendId: string;
  firstStep: boolean;
  updateHovered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { deleteBlock } = useContext(DraftContext);
  let { firstStep, hovered, backendId, updateHovered } = props;
  return (
    <AnimatePresence>
      {hovered && (
        <motion.div
          initial={{
            opacity: 1,
            position: "relative",
            left: "-40px",
            top: "-20px",
            // left: "0px",
            // top: "0px",
          }}
          animate={{ opacity: 1, position: "relative", left: "-64px" }}
          exit={{
            opacity: 0,
            left: "-40px",
            top: "-20px",
          }}
          transition={{ duration: 0.25 }}
          onMouseEnter={(e) => updateHovered(true)}
          onMouseLeave={(e) => updateHovered(false)}
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
              {/* {!firstStep && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveStepUp();
                  }}
                  className={stepStyles["up"]}
                >
                  <span>↑</span>
                </button>
              )} */}
              {/* {!lastStep && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveStepDown();
                  }}
                  className={stepStyles["down"]}
                >
                  {" "}
                  <span>↓</span>
                </button>
              )} */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
