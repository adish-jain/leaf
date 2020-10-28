import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
import "../styles/scrolling.scss";
import { InView } from "react-intersection-observer";
import { Step, timeStamp } from "../typescript/types/app_types";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
const moment = require("moment");

type ScrollingProps = {
  // changeStep: (newStep: number, yPos: number, entered: boolean) => void;
  steps: Step[];
  currentStepIndex: number;
  title: string;
  username: string;
  publishedAtSeconds: number;
  scrollingRef: React.RefObject<HTMLDivElement>;
  pageYOffset: number;
};

type ScrollingState = {
  height: number;
};

type StepDimensions = {
  topY: number;
  bottomY: number;
};

export default class Scrolling extends Component<
  ScrollingProps,
  ScrollingState
> {
  constructor(props: any) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.TitleSection = this.TitleSection.bind(this);

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

  calculateDividerHeight = () => {
    let { height } = this.state;
    let { pageYOffset } = this.props;
    let mid = height / 2;
    if (pageYOffset < mid) {
      return;
    }
  };

  ScrollDown = () => {
    let { pageYOffset } = this.props;
    let style = { opacity: 1 };
    if (pageYOffset > 10) {
      style = {
        opacity: 0,
      };
    }
    return (
      <AnimatePresence>
        <div style={style} className={"scroll-down"}>
          <p> Scroll down to begin</p>
          <span>↓</span>
        </div>
      </AnimatePresence>
    );
  };

  TitleSection() {
    let { username, title, publishedAtSeconds } = this.props;
    let day = moment.unix(publishedAtSeconds);
    let formattedDate = day.format("MMMM Do YYYY");
    return (
      <div>
        <h1 className={"post-title"}>{title}</h1>
        <p className={"published-by"}>
          Published by
          <Link href={`/${username}`}>
            <a>{username}</a>
          </Link>
          on {formattedDate}
        </p>
        <this.ScrollDown />
      </div>
    );
  }

  render() {
    let { steps, currentStepIndex, title, scrollingRef } = this.props;
    let { height } = this.state;

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
