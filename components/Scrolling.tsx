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

type ScrollingState = {
  height: number;
};

export default class Scrolling extends Component<
  ScrollingProps,
  ScrollingState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight,
    });
  }

  render() {
    let { steps, currentStep } = this.props;
    let { height } = this.state;
    return (
      <div className={scrollingStyles["scrolling"]}>
        {steps ? (
          steps.map((step, index) => (
            <PublishedStep
              index={index}
              key={step.id}
              changeStep={this.props.changeStep}
              text={step.text}
              selected={index === currentStep}
              height={height}
            />
          ))
        ) : (
          <div></div>
        )}
        <BufferDiv height={height} />
      </div>
    );
  }
}

function BufferDiv(props: { height: number }) {
  return (
    <div
      style={{
        height: props.height - 300,
      }}
    ></div>
  );
}
