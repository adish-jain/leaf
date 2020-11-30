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
import { Dispatch, SetStateAction } from "react";

export default function CodeStepSection(props: {
  codeSteps: contentBlock[];
  sectionIndex: number;
  currentlySelectedLines: Lines;
  changeSelectedLines: Dispatch<SetStateAction<Lines>>;
}) {
  const {
    codeSteps,
    sectionIndex,
    currentlySelectedLines,
    changeSelectedLines,
  } = props;
  return (
    <div className={codeStepSectionStyles["codestep-section"]}>
      <Publishing sectionIndex={sectionIndex} codeSteps={codeSteps} />
      <CodeEditor
        currentlySelectedLines={currentlySelectedLines}
        changeSelectedLines={changeSelectedLines}
      />
    </div>
  );
}
