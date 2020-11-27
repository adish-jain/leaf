import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import MarkdownPreviewExample from "./MarkdownSection";
import "../styles/text-section.scss";

export default function TextSection(props: {
  slateContent: string;
  sectionIndex: number;
  backendId: string;
}) {
  const { slateContent, sectionIndex, backendId } = props;
  return (
    <div className={"text-section"}>
      <MarkdownPreviewExample
        slateContent={slateContent}
        sectionIndex={sectionIndex}
        contentType={ContentBlockType.Text}
        backendId={backendId}
      />
    </div>
  );
}
