import Publishing from "./Publishing";
import CodeEditor from "./CodeEditor";
import MarkdownSection from "./MarkdownSection";
import codeStepSectionStyles from "../styles/codestep.module.scss";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
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
  currentlySelectedLines: Lines;
  changeSelectedLines: Dispatch<SetStateAction<Lines>>;
}) {
  const [ref, inView, entry] = useInView({});

  const {
    codeSteps,
    sectionIndex,
    currentlySelectedLines,
    changeSelectedLines,
  } = props;
  return (
    <div ref={ref} className={codeStepSectionStyles["codestep-section"]}>
      <CodeStepHeader />
      <div className={codeStepSectionStyles["codestep-content"]}>
        <Publishing sectionIndex={sectionIndex} codeSteps={codeSteps} />
        {inView && (
          <CodeEditor
            currentlySelectedLines={currentlySelectedLines}
            changeSelectedLines={changeSelectedLines}
          />
        )}
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
