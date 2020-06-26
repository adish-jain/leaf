import React, { Component, useEffect } from "react";
const StepStyles = require("../styles/Step.module.scss");
import { InView } from "react-intersection-observer";
import { useInView } from "react-intersection-observer";
import next from "next";
const draftToHtml = require("draftjs-to-html");

type PublishedStepProps = {
  index: number;
  changeStep: (newStep: number) => void;
  text: string;
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
    }
  }, [inView]);

  function renderDraftJS() {
    let rawContentState = JSON.parse(props.text);
    let markup = draftToHtml(rawContentState);
    return { __html: markup };
  }

  return (
    <div ref={ref} className={StepStyles.Step}>
      <h1>{props.index}</h1>
      <div dangerouslySetInnerHTML={renderDraftJS()} />
    </div>
  );
}

export default PublishedStep;
