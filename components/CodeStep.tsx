import MarkdownSection from "./MarkdownSection";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import React, { Component, useContext, useRef, useEffect } from "react";
import { DraftContext } from "../contexts/draft-context";
import stepStyles from "../styles/step.module.scss";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { LinesContext } from "../contexts/lines-context";

export function CodeStep(props: {
  codeStep: contentBlock;
  index: number;
  sectionIndex: number;
  selected: boolean;
  last: boolean;
}) {
  const { codeStep, index, sectionIndex, selected, last } = props;
  const draftContext = useContext(DraftContext);
  const { updateStepCoordinate } = useContext(LinesContext);
  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  const { changeEditingBlock } = draftContext;
  let style = {};

  function handleScroll() {
    const stepDim = stepRef.current?.getBoundingClientRect();
    if (!stepDim) {
      return;
    }
    if (selected) {
      updateStepCoordinate(stepDim);
    }
  }
  if (selected) {
    style["color"] = "blue";
  }
  if (last) {
    style["marginBottom"] = "50%";
  }
  return (
    <div
      className={stepStyles["codestep"]}
      style={style}
      onClick={(e) => {
        changeEditingBlock(codeStep.backendId);
      }}
      ref={stepRef}
    >
      <div className={stepStyles["codestep-content"]}>
        <MarkdownSection
          slateContent={codeStep.slateContent}
          backendId={codeStep.backendId}
          sectionIndex={index + sectionIndex}
          contentType={ContentBlockType.CodeSteps}
          key={codeStep.backendId}
        />
      </div>
      <LineStatus />
    </div>
  );
}

function LineStatus(props: {}) {
  return (
    <div className={stepStyles["line-status"]}>
      <div className={stepStyles["status-content"]}>
        {" "}
        No lines selected | Highlight lines in the code editor.
      </div>
    </div>
  );
}
