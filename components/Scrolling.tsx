import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
const scrollingStyles = require("../styles/Scrolling.module.scss");
import { InView } from "react-intersection-observer";

type StepType = {
  text: string;
  id: string;
};

type ScrollingProps = {
  changeStep: (newStep: number) => void;
  steps: StepType[];
  currentStep: number;
};

type ScrollingState = {};

export default class Scrolling extends Component<
  ScrollingProps,
  ScrollingState
> {
  // myRef: React.CreateRef;
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.state = {};
  }

  handleChange(inView: boolean, entry: IntersectionObserverEntry) {
    console.log(entry);
  }

  render() {
    let { steps, currentStep } = this.props;
    return (
      <InView
        as="div"
        className={scrollingStyles["scrolling"]}
        onChange={this.handleChange}
      >
        {steps ? (
          steps.map((step, index) => (
            <PublishedStep
              index={index}
              key={step.id}
              changeStep={this.props.changeStep}
              text={step.text}
              currentStep={currentStep}
              selected={index === currentStep}
            />
          ))
        ) : (
          <div></div>
        )}
      </InView>
    );
  }
}
