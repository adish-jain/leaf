import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import MarkdownPreviewExample from "./MarkdownSection";
import codeStepStyles from "../styles/codestep.module.scss";
import InView, { useInView } from "react-intersection-observer";
import { useContext, useEffect, useRef } from "react";
import { ContentContext } from "../contexts/finishedpost/content-context";
import { PublishedFilesContext } from "../contexts/finishedpost/files-context";
import PublishedMarkDownSection from "./PublishedMarkDownSection";

export default function PublishedCodeStep(props: {
  slateContent: string;
  startIndex: number;
  backendId: string;
  index: number;
  last: boolean;
}) {
  const heightRef = useRef<HTMLDivElement>(null);
  const [ref, inView, entry] = useInView({
    threshold: calculateThreshold(),
    rootMargin: calculateRootMargin(),
  });
  const { index } = props;
  const { postContent, updateContentIndex, selectedContentIndex } = useContext(
    ContentContext
  );
  const currentContent = postContent[selectedContentIndex];
  const { updateFileIndex, files } = useContext(PublishedFilesContext);

  useEffect(() => {
    if (inView) {
      const correctIndex = startIndex + index;
      updateContentIndex(correctIndex);
      let currentContent = postContent[correctIndex];
      console.log(correctIndex);
      // switch to correct file
      for (let i = 0; i < files.length; i++) {
        if (currentContent.fileId === files[i].fileId) {
          updateFileIndex(i);
        }
      }
    }
  }, [inView]);

  function calculateThreshold() {
    const stepHeight = heightRef.current?.clientHeight || 1;
    if (stepHeight === 0) {
      return 0;
    }
    return 1.0 / stepHeight;
  }

  const { slateContent, startIndex, backendId } = props;
  let style = {};
  const selected = currentContent.backendId === backendId;
  if (selected) {
    style = {
      boxShadow: "0px 4px 16px #edece9",
      border: "1px solid #edece9",
      color: "black",
    };
  }
  return (
    <div ref={ref} style={style} className={codeStepStyles["published"]}>
      <div ref={heightRef}>
        <PublishedMarkDownSection
          slateContent={slateContent}
          startIndex={startIndex}
          backendId={backendId}
          contentType={ContentBlockType.CodeSteps}
        />
      </div>
    </div>
  );
}

function calculateRootMargin() {
  // let { pageYOffset, height } = this.props;
  // if (pageYOffset < height / 2) {
  //   return "0% 0% 0% 0%";
  // }
  return "-49% 0% -49% 0%";
}
