import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
import "../styles/scrolling.scss";
import { InView } from "react-intersection-observer";
import { Step, timeStamp } from "../typescript/types/app_types";
const moment = require("moment");

type ScrollingProps = {
  // changeStep: (newStep: number, yPos: number, entered: boolean) => void;
  steps: Step[];
  currentStepIndex: number;
  title: string;
  updateStep: React.Dispatch<React.SetStateAction<number>>;
  username: string;
  publishedAtSeconds: number;
  scrollingRef: React.RefObject<HTMLDivElement>;
};

type ScrollingState = {
  height: number;
  pageYOffset: number;
  selectedStepIndex: number;
};

type StepDimensions = {
  topY: number;
  bottomY: number;
};

var stepCoords: StepDimensions[] = [];

export default class Scrolling extends Component<
  ScrollingProps,
  ScrollingState
> {
  private scrollingRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateScrollPosition = this.updateScrollPosition.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.calculateDividerHeight = this.calculateDividerHeight.bind(this);

    this.TitleSection = this.TitleSection.bind(this);

    this.state = {
      height: 0,
      pageYOffset: 0,
      selectedStepIndex: 0,
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.findSteps();
    // console.log(stepCoords);

    // window.addEventListener("scroll", this.updateScrollPosition);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    // window.removeEventListener("scroll", this.updateScrollPosition);
  }

  updateScrollPosition() {
    let selectedStepIndex = this.selectStep(
      window.pageYOffset + this.state.height / 2
    );
    this.setState({
      pageYOffset: window.pageYOffset,
      selectedStepIndex: this.selectStep(
        window.pageYOffset + this.state.height / 2
      ),
    });
    // this.props.updateStep(selectedStepIndex);
  }

  findSteps() {
    let children = this.scrollingRef.current?.children;
    if (children === undefined) {
      return;
    }
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let coords = child.getBoundingClientRect();
      // console.log(coords);
      // let centerCoord = coords.top + coords.height / 2;
      // stepCoords.push(centerCoord);
      stepCoords.push({
        topY: coords.top,
        bottomY: coords.bottom,
      });
    }
  }

  selectStep(pos: number) {
    for (let i = 0; i < stepCoords.length; i++) {
      if (pos >= stepCoords[i].topY - 32 && pos <= stepCoords[i].bottomY) {
        return i;
      }
    }
    return stepCoords.length - 1;
  }

  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight,
    });
  }

  handleScroll(event: React.UIEvent<HTMLDivElement, UIEvent>) {
    console.log("scrolling");
    // console.log(event);
  }

  handleChange(inView: boolean, entry: IntersectionObserverEntry) {
    // console.log(entry);
  }

  calculateDividerHeight() {
    let { height, pageYOffset } = this.state;
    let mid = height / 2;
    if (pageYOffset < mid) {
      return;
    }
  }

  TitleSection() {
    function ScrollDown(props: { pageYOffset: number }) {
      let style = { opacity: 1 };
      if (pageYOffset > 10) {
        style = {
          opacity: 0,
        };
      }
      return (
        <div style={style} className={"scroll-down"}>
          <p> Scroll down to begin</p>
          <span>↓</span>
        </div>
      );
    }
    let { username, title, publishedAtSeconds } = this.props;
    let { pageYOffset } = this.state;
    let day = moment.unix(publishedAtSeconds);
    let formattedDate = day.format("MMMM Do YYYY");
    return (
      <div>
        <h1 className={"post-title"}>{title}</h1>
        <p className={"published-by"}>
          Published by {username} on {formattedDate}
        </p>
        <ScrollDown pageYOffset={pageYOffset} />
      </div>
    );
  }

  render() {
    let { steps, currentStepIndex, title, scrollingRef } = this.props;
    let { height, pageYOffset, selectedStepIndex } = this.state;
    // console.log("render scrolling");
    return (
      <div className={"scrolling"}>
        <this.TitleSection />
        {/* <div
          style={{ top: `${height / 2}px` }}
          className={"intersection-zone"}
        ></div> */}
        {steps ? (
          <div ref={scrollingRef}>
            {steps.map((step, index) => (
              <PublishedStep
                index={index}
                key={step.id}
                // changeStep={this.props.changeStep}
                text={step.text}
                selected={index === currentStepIndex}
                height={height}
              />
            ))}
          </div>
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
