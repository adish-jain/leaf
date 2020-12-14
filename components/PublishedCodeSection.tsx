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
export default function PublishedCodeStepSection(props: {
  codeSteps: contentBlock[];
  startIndex: number;
  scrollSpeed: number;
}) {
  const { codeSteps, startIndex, scrollSpeed } = props;
  return (
    <div className={codeStepSectionStyles["codestep-section"]}>
      <div className={codeStepSectionStyles["codestep-content"]}>
        <CodeSteps codeSteps={codeSteps} startIndex={startIndex} />
        <PublishedCodeEditor scrollSpeed={scrollSpeed} />
      </div>
    </div>
  );
}

function CodeSteps(props: { codeSteps: contentBlock[]; startIndex: number }) {
  const { codeSteps, startIndex } = props;
  return (
    <div className={codeStepSectionStyles["published-steps"]}>
      <ScrollDown />
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
      {/* <ScrollDown /> */}
      <BufferDiv />
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
        height: "100px",
      }}
    ></div>
  );
}

function ScrollDown() {
  const componentWrapper = useRef<HTMLDivElement>(null);
  let style = { opacity: 1 };
  const [state, updateState] = useState({
    yPos: 0,
    scrollPosition: 0,
  });

  function handleScroll() {
    if (process.browser) {
      console.log("page y offset is ");
      console.log(window.pageYOffset);
      updateState({ ...state, scrollPosition: window.pageYOffset });
    }
  }

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const dimensions = componentWrapper.current?.getBoundingClientRect();
    if (dimensions) {
      console.log("dimensions are ");
      console.log(dimensions);
      if (dimensions.top === 0) {
        console.log("updating to 0");
      }
      updateState({
        ...state,
        yPos: dimensions.top,
      });
      console.log("updating to ", dimensions?.top);
    }
  }, []);
  // console.log("scrollpos is ", state.scrollPosition);
  console.log("ypos is ", state.yPos);
  const fadeOut = state.scrollPosition - state.yPos > 10;
  console.log(fadeOut);
  return (
    <AnimatePresence>
      <motion.div
        ref={componentWrapper}
        style={style}
        className={scrollingStyles["scroll-down"]}
      >
        <p> Continue scrolling</p>
        <span>↓</span>
      </motion.div>
    </AnimatePresence>
  );
}
