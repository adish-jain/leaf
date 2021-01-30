import blockSectionStyles from "../../styles/finishedpost/block_section.module.scss";
import { contentBlock } from "../../typescript/types/frontend/postTypes";
import { useCallback, useContext, useEffect, useState } from "react";
import RightPane from "../RightPane";

import scrollingStyles from "../../styles/scrolling.module.scss";
import { DimensionsContext } from "../../contexts/dimensions-context";
import { MOBILE_WIDTH } from "../../pages/_app";
import { ContentBlockType } from "../../typescript/enums/backend/postEnums";
import ContentBlock from "./ContentBlock";
import { SectionContext } from "../../contexts/section-context";
import { ImageDimensionsContext } from "../../contexts/finishedpost/imagedimension-context";
import { contentBlockStyles } from "../../styles/allStyles";
import { StepDimensionContext } from "./stepdimension-context";

export default function ContentBlockSection(props: {
  contentBlocks: contentBlock[];
  startIndex: number;
  scrollSpeed: number;
}) {
  const { contentBlocks, startIndex, scrollSpeed } = props;
  const contentBlockType = contentBlocks[0].type;
  const [imageDimensions, updateImageDimensions] = useState<
    undefined | DOMRect
  >(undefined);
  const [stepDimensions, updateStepDimensions] = useState<undefined | DOMRect>(
    undefined
  );
  return (
    <SectionContext.Provider
      value={{
        sectionType: contentBlockType,
      }}
    >
      <StepDimensionContext.Provider
        value={{
          stepDimensions,
          updateStepDimensions,
        }}
      >
        <ImageDimensionsContext.Provider
          value={{
            imageDimensions,
            updateImageDimensions,
          }}
        >
          <div
            className={blockSectionStyles["block-section"]}
            // style={codeStepContentStyle}
          >
            <RightPane
              scrollSpeed={scrollSpeed}
              contentBlockType={contentBlockType}
            />
            <ContentBlocks
              contentBlocks={contentBlocks}
              startIndex={startIndex}
              scrollSpeed={scrollSpeed}
            />
            {/* <ViewPortLine /> */}
          </div>
          <HighlightSVG />
        </ImageDimensionsContext.Provider>
      </StepDimensionContext.Provider>
    </SectionContext.Provider>
  );
}

function ViewPortLine() {
  return (
    <div
      style={{
        position: "fixed",
        height: "1vh",
        backgroundColor: "red",
        top: "49vh",
        width: "100%",
      }}
    ></div>
  );
}

function HighlightSVG() {
  const { imageDimensions } = useContext(ImageDimensionsContext);
  const { stepDimensions } = useContext(StepDimensionContext);
  const [scrollPos, updateScrollPosition] = useState(0);
  const { height, width } = useContext(DimensionsContext);
  const handleScroll = useCallback((event) => {
    // update scroll speed
    // updateScrollSpeed(scrollSpeed);
    updateScrollPosition(window.scrollY);
  }, []);
  // console.log("Scroll pos is ", scrollPos);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className={contentBlockStyles["highlight-polygon"]}
      style={
        {
          // top: stepDimensions?.top || 0 + window.scrollY,
          // top: stepDimensions?.top || 0 + scrollPos,
          // top: stepDimensions?.top + scrollPos - stepDimensions?.height,
          // top: stepDimensions?.top + scrollPos,
          // top: stepDimensions?.top + scrollPos,
          // top: imageDimensions?.top + scrollPos,
          // top: stepDimensions?.top - scrollPos,
          // right: stepDimensions?.right,
          // left: stepDimensions?.x + stepDimensions?.width,
          // left: stepDimensions?.left || 0 + (stepDimensions?.width || 0),
        }
      }
    >
      {stepDimensions && imageDimensions && (
        <svg
          width={width}
          // height={`${imageDimensions?.height || 0}`}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            // d={`M1 223.5V72L202 1.5V327L1 223.5Z`}
            // d={`
            // M 0,0
            // L 40, ${imageDimensions?.top}
            // V - ${imageDimensions?.height}
            // L202 1.5
            // V327L1 223.5Z
            // `}
            strokeWidth={1}
            d={`
        M ${stepDimensions.x + stepDimensions.width},${
              stepDimensions.y + scrollPos
            }
        L ${imageDimensions.x}, ${imageDimensions.y + scrollPos}
        v ${imageDimensions.height}
        L ${stepDimensions.x + stepDimensions.width}, ${
              stepDimensions.bottom + scrollPos
            }
        Z
        `}
            fill="red"
            stroke="red"
            // fill="#F5E764"
            // stroke="#F5E764"
          />
        </svg>
      )}
    </div>
  );
}

function ContentBlocks(props: {
  contentBlocks: contentBlock[];
  startIndex: number;
  scrollSpeed: number;
}) {
  const { contentBlocks, startIndex, scrollSpeed } = props;
  const { width } = useContext(DimensionsContext);
  const isMobile = width < MOBILE_WIDTH;
  return (
    <div className={blockSectionStyles["published-steps"]}>
      {/* <ScrollDown /> */}
      {/* {isMobile && <PublishedCodeEditor scrollSpeed={scrollSpeed} />} */}
      <div className={blockSectionStyles["codesteps-wrapper"]}>
        {contentBlocks.map((contentBlock, index) => {
          return (
            <ContentBlock
              contentBlock={contentBlock}
              startIndex={startIndex}
              index={index}
              last={index == contentBlocks.length - 1}
              key={contentBlock.backendId}
            />
          );
        })}
      </div>
      {/* <ScrollDown /> */}
      {!isMobile && <BufferDiv />}
    </div>
  );
}

function BufferDiv(props: {}) {
  const { height } = useContext(DimensionsContext);

  return (
    <div
      id="bufferdiv"
      style={{
        height: `${height / 2}px`,
      }}
    ></div>
  );
}

function ScrollDown() {
  let style = { opacity: 1 };

  return (
    <div style={style} className={scrollingStyles["scroll-down"]}>
      <p> Continue scrolling</p>
      <span>↓</span>
    </div>
  );
}
