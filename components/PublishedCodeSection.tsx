import codeStepSectionStyles from "../styles/codestep.module.scss";
import {
  contentBlock,
  fileObject,
  Lines,
} from "../typescript/types/frontend/postTypes";
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
import { ContentBlock } from "draft-js";
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

  const { width } = useContext(DimensionsContext);
  const isMobile = width < MOBILE_WIDTH;

  let codeStepContentStyle = isMobile
    ? { marginLeft: 0, marginTop: 0, display: "block", position: "relative" }
    : {};

  return (
    <div className={codeStepSectionStyles["codestep-section"]}>
      <div
        className={codeStepSectionStyles["codestep-content"]}
        style={codeStepContentStyle}
      >
        <CodeSteps
          codeSteps={codeSteps}
          startIndex={startIndex}
          scrollSpeed={scrollSpeed}
        />
        {!isMobile && <PublishedCodeEditor scrollSpeed={scrollSpeed} />}
      </div>
    </div>
  );
}

function CodeSteps(props: {
  codeSteps: contentBlock[];
  startIndex: number;
  scrollSpeed: number;
}) {
  const stepWrapper = useRef<HTMLDivElement>(null);
  const { codeSteps, startIndex, scrollSpeed } = props;
  const { width } = useContext(DimensionsContext);
  const isMobile = width < MOBILE_WIDTH;
  let wrapperStyle = isMobile
    ? {
        width: "100%",
      }
    : {};
  let codeStepsStyle = isMobile
    ? {
        position: "relative",
        top: "-50vh",
      }
    : {};

  return (
    <div
      style={wrapperStyle}
      ref={stepWrapper}
      className={codeStepSectionStyles["published-steps"]}
    >
      <ScrollDown />
      {isMobile && <PublishedCodeEditor scrollSpeed={scrollSpeed} />}
      <div style={codeStepsStyle}>
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
  const [height, updateHeight] = useState(0);

  useEffect(() => {
    updateHeight(window.innerHeight);
  }, []);
  return (
    <div
      style={{
        height: "200px",
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
