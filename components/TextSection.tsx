import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import MarkdownPreviewExample from "./MarkdownSection";
import textSectionStyles from "../styles/text-section.module.scss";

export default function TextSection(props: {
  slateContent: string;
  sectionIndex: number;
  backendId: string;
}) {
  const { slateContent, sectionIndex, backendId } = props;
  return (
    <div className={textSectionStyles["text-section"]}>
      <MarkdownPreviewExample
        slateContent={slateContent}
        sectionIndex={sectionIndex}
        contentType={ContentBlockType.Text}
        backendId={backendId}
      />
    </div>
  );
}
