import codeStepSectionStyles from "../styles/codestep.module.scss";
import {
  contentBlock,
  fileObject,
  Lines,
} from "../typescript/types/frontend/postTypes";
import CSS from "csstype";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DraftContext } from "../contexts/draft-context";
import { useInView } from "react-intersection-observer";
import { PreviewContext } from "./preview-context";
import PublishedCodeEditor from "./PublishedCodeEditor";
import PublishedCodeStep from "./PublishedCodeStep";
import { AnimatePresence, motion } from "framer-motion";
import scrollingStyles from "../styles/scrolling.module.scss";
import { DimensionsContext } from "../contexts/dimensions-context";
import { MOBILE_WIDTH } from "../pages/_app";
import { relative } from "path";
export default function PublishedCodeStepSection(props: {
  codeSteps: contentBlock[];
  startIndex: number;
  scrollSpeed: number;
}) {
  const { codeSteps, startIndex, scrollSpeed } = props;

  return (
    <div className={codeStepSectionStyles["codestep-section"]}>
      <div
        className={codeStepSectionStyles["codestep-content"]}
        // style={codeStepContentStyle}
      >
        <PublishedCodeEditor scrollSpeed={scrollSpeed} />
        <CodeSteps
          codeSteps={codeSteps}
          startIndex={startIndex}
          scrollSpeed={scrollSpeed}
        />
      </div>
    </div>
  );
}

function CodeSteps(props: {
  codeSteps: contentBlock[];
  startIndex: number;
  scrollSpeed: number;
}) {
  const { codeSteps, startIndex, scrollSpeed } = props;
  const { width } = useContext(DimensionsContext);
  const isMobile = width < MOBILE_WIDTH;
  return (
    <div className={codeStepSectionStyles["published-steps"]}>
      <ScrollDown />
      {/* {isMobile && <PublishedCodeEditor scrollSpeed={scrollSpeed} />} */}
      <div className={codeStepSectionStyles["codesteps-wrapper"]}>
        {codeSteps.map((codeStep, index) => {
          return (
            <PublishedCodeStep
              backendId={codeStep.backendId}
              slateContent={codeStep.slateContent}
              startIndex={startIndex}
              index={index}
              last={index == codeSteps.length - 1}
              key={codeStep.backendId}
            />
          );
        })}
      </div>
      {/* <ScrollDown /> */}
      {!isMobile && <BufferDiv />}
    </div>
  );
}

function BufferDiv(props: {}) {
  const { height } = useContext(DimensionsContext);

  return (
    <div
      id="bufferdiv"
      style={{
        height: `${height / 2}px`,
      }}
    ></div>
  );
}

function ScrollDown() {
  let style = { opacity: 1 };

  return (
    <div style={style} className={scrollingStyles["scroll-down"]}>
      <p> Continue scrolling</p>
      <span>↓</span>
    </div>
  );
}
