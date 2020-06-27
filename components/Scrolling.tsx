import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
const scrollingStyles = require("../styles/Scrolling.module.scss");
import { InView } from "react-intersection-observer";

type StepType = {
  text: string;
  id: string;
};

type ScrollingProps = {
  changeStep: (newStep: number, yPos: number, entered: boolean) => void;
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

  render() {
    let { steps, currentStep } = this.props;
    return (
      <div className={scrollingStyles["scrolling"]}>
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
      </div>
    );
  }
}
