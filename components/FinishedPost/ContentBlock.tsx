import { ContentBlockType } from "../../typescript/enums/backend/postEnums";
import MarkdownPreviewExample from "../MarkdownSection";
import InView, { useInView } from "react-intersection-observer";
import { useCallback, useContext, useEffect, useRef } from "react";
import { ContentContext } from "../../contexts/finishedpost/content-context";
import { PublishedFilesContext } from "../../contexts/finishedpost/files-context";
import PublishedMarkDownSection from "../PublishedMarkDownSection";
import { DimensionsContext } from "../../contexts/dimensions-context";
import { MOBILE_WIDTH } from "../../pages/_app";
import { contentBlock } from "../../typescript/types/frontend/postTypes";
import { AnimatePresence, motion } from "framer-motion";
import { contentBlockStyles } from "../../styles/allStyles";
import { ImageDimensionsContext } from "../../contexts/finishedpost/imagedimension-context";
import { StepDimensionContext } from "./stepdimension-context";

export default function ContentBlock(props: {
  startIndex: number;
  index: number;
  last: boolean;
  contentBlock: contentBlock;
}) {
  const heightRef = useRef<HTMLDivElement>(null);
  const stepHeight = heightRef.current?.clientHeight || 1;
  const { width } = useContext(DimensionsContext);
  const { updateStepDimensions } = useContext(StepDimensionContext);
  const isMobile = width < MOBILE_WIDTH;
  const [ref, inView, entry] = useInView({
    threshold: calculateThreshold(),
    rootMargin: calculateRootMargin(isMobile),
  });
  const { index } = props;
  const { postContent, updateContentIndex, selectedContentIndex } = useContext(
    ContentContext
  );

  const currentContent = postContent[selectedContentIndex];
  const { updateFileIndex, files } = useContext(PublishedFilesContext);

  const handleScroll = useCallback(
    (event) => {
      // update scroll speed
      // updateScrollSpeed(scrollSpeed);
      // updateScrollPosition(window.scrollY);
      const stepDimensions = heightRef.current?.getBoundingClientRect();

      if (stepDimensions && inView) {
        console.log("updating stim dems in ", index);
        // console.log("sending dimensions for step", index);
        updateStepDimensions(stepDimensions);
      }
    },
    [inView]
  );
  // console.log("Scroll pos is ", scrollPos);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (inView) {
      const stepDimensions = heightRef.current?.getBoundingClientRect();

      if (stepDimensions) {
        console.log("sending dimensions for step", index);
        updateStepDimensions(stepDimensions);
      }

      const correctIndex = startIndex + index;
      updateContentIndex(correctIndex);
      let currentContent = postContent[correctIndex];
      // switch to correct file
      for (let i = 0; i < files.length; i++) {
        if (currentContent.fileId === files[i].fileId) {
          updateFileIndex(i);
        }
      }
    }
  }, [inView]);

  function calculateThreshold() {
    if (stepHeight === 0) {
      return 0;
    }
    return 1.0 / stepHeight;
  }

  const { startIndex, contentBlock } = props;
  const { backendId, slateContent } = contentBlock;
  let style = {};
  const selected = currentContent.backendId === backendId;
  if (selected) {
    style = {
      // boxShadow: "0px 4px 16px #edece9",
      // border: "1px solid #edece9",
      // color: "rgba(41, 41, 41, 0.87)",
      backgroundColor: "#F5E764",
      // borderRadius: '4px'
      // color: 'red'
    };
  }

  return (
    <AnimatePresence>
      <div
        // key={backendId + selected.toString()}
        ref={ref}
        // style={style}
        // data-isOn={selected}
        // transition={{ duration: 0.3 }}
        style={style}
        id={backendId}
        className={contentBlockStyles["content"]}
      >
        <div ref={heightRef}>
          <PublishedMarkDownSection
            slateContent={slateContent}
            startIndex={startIndex}
            backendId={backendId}
            contentType={ContentBlockType.CodeSteps}
          />
        </div>
      </div>
    </AnimatePresence>
  );
}

function calculateRootMargin(isMobile: boolean) {
  if (isMobile) {
    return "-39% 0% -60% 0%";
  } else {
    return "-49% 0% -49% 0%";
  }
}
