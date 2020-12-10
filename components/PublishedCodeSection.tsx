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
  useState,
} from "react";
import { DraftContext } from "../contexts/draft-context";
import { useInView } from "react-intersection-observer";
import { PreviewContext } from "./preview-context";
import PublishedCodeEditor from "./PublishedCodeEditor";
import { ContentBlock } from "draft-js";
import PublishedCodeStep from "./PublishedCodeStep";
import { AnimatePresence } from "framer-motion";
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
        height: height / 2,
      }}
    ></div>
  );
}

function ScrollDown() {
  //   let { pageYOffset } = this.props;
  let style = { opacity: 1 };
  //   if (pageYOffset > 10) {
  //     style = {
  //       opacity: 0,
  //     };
  //   }
  return (
    <AnimatePresence>
      <div style={style} className={scrollingStyles["scroll-down"]}>
        <p> Continue scrolling</p>
        <span>↓</span>
      </div>
    </AnimatePresence>
  );
}
