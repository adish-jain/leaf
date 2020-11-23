import Publishing from "./Publishing";
import CodeEditor from "./CodeEditor";
import MarkdownSection from "./MarkdownSection";
import "../styles/codestep.scss";

export default function CodeStepSection(props) {
  const {
    sectionIndex,
    updateSlateSectionToBackend,
    addBackendBlock,
    backendId,
    slateContent,
  } = props;
  return (
    <div className={"codestep-section"}>
      <MarkdownSection
        slateContent={slateContent}
        backendId={backendId}
        sectionIndex={sectionIndex}
        updateSlateSectionToBackend={updateSlateSectionToBackend}
        addBackendBlock={addBackendBlock}
      />
    </div>
  );
}
