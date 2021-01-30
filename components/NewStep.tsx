import React, { Component, useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { SectionContext } from "../contexts/section-context";
import newStepStyles from "../styles/newstep.module.scss";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";

type NewStepProps = {
  lastStepId: string;
  lastIndex: number;
};

type NewStepState = {};

export function NewStep(props: NewStepProps) {
  const { lastStepId, lastIndex } = props;
  const { sectionType } = useContext(SectionContext);
  const { addBackendBlock, nextBlockType } = useContext(DraftContext);
  return (
    <div className={newStepStyles["NewStep"]}>
      {sectionType === ContentBlockType.CodeSteps && (
        <button
          onClick={(e) => {
            addBackendBlock(ContentBlockType.CodeSteps, lastIndex);
          }}
        >
          + Add Code Step
        </button>
      )}
      {sectionType === ContentBlockType.Image && (
        <button
          onClick={(e) => {
            addBackendBlock(ContentBlockType.Image, lastIndex);
          }}
        >
          + Add Image Step
        </button>
      )}
      {nextBlockType(lastStepId) !== ContentBlockType.Text && (
        <button
          onClick={(e) => {
            addBackendBlock(ContentBlockType.Text, lastIndex);
          }}
        >
          + Add Single Column Text Section
        </button>
      )}
    </div>
  );
}
