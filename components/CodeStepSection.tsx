import Publishing from "./Publishing";
import CodeEditor from "./CodeEditor";
import MarkdownSection from "./MarkdownSection";
import codeStepSectionStyles from "../styles/codestep.module.scss";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { opacityFade } from "../styles/framer_animations/opacityFade";
import {
  contentBlock,
  fileObject,
  Lines,
} from "../typescript/types/frontend/postTypes";
import { Dispatch, SetStateAction, useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { useInView } from "react-intersection-observer";
export default function CodeStepSection(props: {
  codeSteps: contentBlock[];
  sectionIndex: number;
}) {
  const [ref, inView, entry] = useInView({});

  const { codeSteps, sectionIndex } = props;
  return (
    <div ref={ref} className={codeStepSectionStyles["codestep-section"]}>
      <CodeStepHeader />
      <div className={codeStepSectionStyles["codestep-content"]}>
        <Publishing sectionIndex={sectionIndex} codeSteps={codeSteps} />
        <CodeEditor inView={inView} />
      </div>
    </div>
  );
}

function CodeStepHeader() {
  return (
    <div className={codeStepSectionStyles["header"]}>
      <div className={codeStepSectionStyles["divider"]}></div>
      {/* <h3> Code Step Section</h3> */}
    </div>
  );
}
