import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import textSectionStyles from "../styles/text-section.module.scss";
import { useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { start } from "repl";
import { PreviewContext } from "./preview-context";
import PublishedMarkDownSection from "./PublishedMarkDownSection";

export default function PublishedTextSection(props: {
  slateContent: string;
  startIndex: number;
  backendId: string;
}) {
  const { slateContent, startIndex, backendId } = props;
  return (
    <div className={textSectionStyles["text-section"]}>
      <div className={textSectionStyles["markdown"]}>
        <PublishedMarkDownSection
          slateContent={slateContent}
          startIndex={startIndex}
          contentType={ContentBlockType.Text}
          backendId={backendId}
        />
      </div>
    </div>
  );
}
