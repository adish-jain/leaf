import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
const scrollingStyles = require("../styles/Scrolling.module.scss");

var shortid = require("shortid");

// const steps = [
//   0,
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   9,
//   10,
//   11,
//   12,
//   13,
//   14,
//   15,
//   16,
//   17,
//   18,
//   19,
// ];

type StepType = {
  text: String;
  id: String;
};

type ScrollingProps = {
  changeStep: (newStep: number) => void;
  steps: StepType[];
};

export default class Scrolling extends Component<ScrollingProps> {
  // myRef: React.CreateRef;
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      inView: 0,
    };
  }

  render() {
    let { steps } = this.props;
    return (
      <div className={scrollingStyles["scrolling"]}>
        {steps.map((step, index) => (
          <PublishedStep
            index={index}
            key={step.id}
            changeStep={this.props.changeStep}
            text={step.text}
          >
          </PublishedStep>
        ))}
      </div>
    );
  }
}
