import Publishing from "./Publishing";
import CodeEditor from "./CodeEditor";
import MarkdownSection from "./MarkdownSection";
import "../styles/codestep.scss";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import {
  contentBlock,
  fileObject,
} from "../typescript/types/frontend/postTypes";
import { DraftContext } from "../contexts/draft-context";

export default function CodeStepSection(props: {
  codeSteps: contentBlock[];
  sectionIndex: number;
}) {
  const { codeSteps, sectionIndex } = props;
  return (
    <div className={"codestep-section"}>
      <Publishing sectionIndex={sectionIndex} codeSteps={codeSteps} />
      <CodeEditor />
    </div>
  );
}
