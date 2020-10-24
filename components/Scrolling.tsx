import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
import "../styles/scrolling.scss";
import { InView } from "react-intersection-observer";
import { Step } from "../typescript/types/app_types";

type ScrollingProps = {
  changeStep: (newStep: number, yPos: number, entered: boolean) => void;
  steps: Step[];
  tags: string[];
  currentStepIndex: number;
  title: string;
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
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

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
    let { steps, currentStepIndex, title, tags } = this.props;
    let { height } = this.state;
    return (
      <div className={"scrolling"}>
        <h1 className={"post-title"}>{title}</h1>
        <div className={"post-tags"}>
          {tags.map((tag: string) => (
            <div className={"post-tag"}>{tag}</div>))
          }
        </div>
        {steps ? (
          steps.map((step, index) => (
            <PublishedStep
              index={index}
              key={step.id}
              changeStep={this.props.changeStep}
              text={step.text}
              selected={index === currentStepIndex}
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
        height: props.height,
      }}
    ></div>
  );
}
