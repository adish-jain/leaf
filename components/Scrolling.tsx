import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
const scrollingStyles = require("../styles/Scrolling.module.scss");

var shortid = require("shortid");

type StepType = {
  text: string;
  id: string;
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
        {steps ? (
          steps.map((step, index) => (
            <PublishedStep
              index={index}
              key={step.id}
              changeStep={this.props.changeStep}
              text={step.text}
            />
          ))
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
