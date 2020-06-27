import React, { Component, useEffect } from "react";
const StepStyles = require("../styles/PublishedStep.module.scss");
import { useInView } from "react-intersection-observer";
const draftToHtml = require("draftjs-to-html");

type PublishedStepProps = {
  index: number;
  changeStep: (newStep: number) => void;
  text: string;
  selected: boolean;
  currentStep: number;
};

function PublishedStep(props: PublishedStepProps) {
  const [ref, inView, entry] = useInView({
    /* Optional options */
    // root: props.root,
    threshold: 1,
    rootMargin: "10% 0% -50% 0%",
  });

  useEffect(() => {
    if (inView) {
      props.changeStep(props.index);
      //   console.log(entry);
    }
  }, [inView]);

  function renderDraftJS() {
    let rawContentState = JSON.parse(props.text);
    let markup = draftToHtml(rawContentState);
    return { __html: markup };
  }

  let stepStyle = props.selected ? "Step--Selected" : "Step";
  return (
    <div ref={ref} className={StepStyles[stepStyle]}>
      {/* <h1>{props.index}</h1> */}
      <div dangerouslySetInnerHTML={renderDraftJS()} />
    </div>
  );
}

export default PublishedStep;
