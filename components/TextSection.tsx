import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import MarkdownPreviewExample from "./MarkdownSection";
import textSectionStyles from "../styles/text-section.module.scss";
import { useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { start } from "repl";

export default function TextSection(props: {
  slateContent: string;
  startIndex: number;
  backendId: string;
}) {
  const { nextBlockType } = useContext(DraftContext);
  const { slateContent, startIndex, backendId } = props;
  const showAddCodeStep =
    nextBlockType(backendId) !== ContentBlockType.CodeSteps;

  return (
    <div className={textSectionStyles["text-section"]}>
      <TextSectionDescription startIndex={startIndex} backendId={backendId} />
      <div className={textSectionStyles["markdown"]}>
        <MarkdownPreviewExample
          slateContent={slateContent}
          startIndex={startIndex}
          contentType={ContentBlockType.Text}
          backendId={backendId}
        />
      </div>
      {showAddCodeStep && (
        <AddCodeStep startIndex={startIndex} backendId={backendId} />
      )}
    </div>
  );
}

function TextSectionDescription(props: {
  startIndex: number;
  backendId: string;
}) {
  const { startIndex, backendId } = props;
  const { deleteBlock } = useContext(DraftContext);
  return (
    <div className={textSectionStyles["description"]}>
      <p>
        This is a single column text section. Write as if a normal blog post.
      </p>
      {startIndex !== 0 ? (
        <button
          onClick={(e) => deleteBlock(backendId)}
          className={textSectionStyles["delete"]}
        >
          Delete section
        </button>
      ) : (
        <p> Press '/' for commands.</p>
      )}
    </div>
  );
}

function AddCodeStep(props: { backendId: string; startIndex: number }) {
  const { startIndex } = props;
  const { addBackendBlock } = useContext(DraftContext);

  return (
    <button
      onClick={(e) => addBackendBlock(ContentBlockType.CodeSteps, startIndex)}
      className={textSectionStyles["addcode"]}
    >
      + Add Code Section
    </button>
  );
}
