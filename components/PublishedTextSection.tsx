import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import textSectionStyles from "../styles/text-section.module.scss";
import { useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { start } from "repl";
import { PreviewContext } from "./preview-context";
import PublishedMarkDownSection from "./PublishedMarkDownSection";
import { DimensionsContext } from "../contexts/dimensions-context";
import { MOBILE_WIDTH } from "../pages/_app";

export default function PublishedTextSection(props: {
  slateContent: string;
  startIndex: number;
  backendId: string;
}) {
  const { slateContent, startIndex, backendId } = props;
  const { width } = useContext(DimensionsContext);

  let style = width < MOBILE_WIDTH ? { width: "100%" } : {};
  return (
    <div
      className={textSectionStyles["text-section"]}
      // style={style}
    >
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
