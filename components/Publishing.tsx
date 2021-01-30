import React, { Component, createContext, useContext } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { NewStep } from "./NewStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
import publishingStyles from "../styles/publishing.module.scss";
import { File, Step, Lines } from "../typescript/types/app_types";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { ContentStep } from "./ContentStep";
import { AnimateSharedLayout, motion } from "framer-motion";
import { DraftContext } from "../contexts/draft-context";
import Preview from "./Preview";
import { PreviewContext } from "./preview-context";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { SectionContext } from "../contexts/section-context";
var shortId = require("shortid");

type PublishingProps = {
  contentBlocks: contentBlock[];
  startIndex: number;
  contentBlockType: ContentBlockType;
  // what step is currently being edited? -1 means no steps being edited
};

type PublishingState = {
  previewLoading: boolean;
};

export default function Publishing(props: PublishingProps) {
  const { contentBlocks, startIndex, contentBlockType } = props;
  const draftContext = useContext(DraftContext);
  const { currentlyEditingBlock } = draftContext;
  const { previewMode } = useContext(PreviewContext);

  return (
    <SectionContext.Provider
      value={{
        sectionType: contentBlockType,
      }}
    >
      <div className={publishingStyles["publishing"]}>
        {!previewMode && <PublishingDescription />}
        {/* <AnimateSharedLayout> */}
        <motion.div
          className={publishingStyles["codesteps"]}
          //  layout
        >
          {contentBlocks.map((contentBlock, index) => {
            return (
              <ContentStep
                currentContentBlock={contentBlock}
                index={index}
                key={contentBlock.backendId}
                startIndex={startIndex}
                selected={
                  contentBlock.backendId === currentlyEditingBlock?.backendId
                }
                last={index === contentBlocks.length - 1}
              />
            );
          })}
        </motion.div>
        {!previewMode && (
          <NewStep
            lastStepId={contentBlocks[contentBlocks.length - 1].backendId}
            lastIndex={startIndex + contentBlocks.length - 1}
          />
        )}
        {/* </AnimateSharedLayout> */}
      </div>
    </SectionContext.Provider>
  );
}

function PublishingDescription() {
  let descriptionText;
  const { sectionType } = useContext(SectionContext);

  switch (sectionType) {
    case ContentBlockType.Image:
      descriptionText = imageDescription;
      break;
    case ContentBlockType.CodeSteps:
      descriptionText = codeDescription;
    default:
      break;
  }
  return (
    <div className={publishingStyles["description"]}>
      <p>{descriptionText}</p>
      {/* <button>Delete Code Section</button> */}
    </div>
  );
}

const codeDescription = `  This is a code step section. Highlight lines in the code editor to pair
with a step. Scroll down to begin.`;

const imageDescription = ` This is a image step section. Upload an image to pair
with a step. Scroll down to begin.`;
