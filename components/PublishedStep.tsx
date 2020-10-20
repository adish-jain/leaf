import React, { Component, useEffect } from "react";
import "../styles/publishedstep.scss";
import { useInView, InView } from "react-intersection-observer";
const draftToHtml = require("draftjs-to-html");
import animateScrollTo from "animated-scroll-to";
import { motion, AnimatePresence } from "framer-motion";

type PublishedStepProps = {
  index: number;
  changeStep: (newStep: number, yPos: number, entered: boolean) => void;
  text: string;
  selected: boolean;
  height: number;
  intersectionRef: React.RefObject<HTMLDivElement>;
  pageYOffset: number;
};

type PublishedStepState = {
  stepHeight: number;
};

class PublishedStep extends Component<PublishedStepProps, PublishedStepState> {
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: PublishedStepProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
    this.calculateThreshold = this.calculateThreshold.bind(this);
    this.calculateRootMargin = this.calculateRootMargin.bind(this);

    this.myRef = React.createRef();

    this.state = {
      stepHeight: 0,
    };
  }

  componentDidMount() {
    this.setState({
      stepHeight: this.myRef.current!.clientHeight,
    });
  }

  renderDraftJS() {
    let rawContentState = JSON.parse(this.props.text);
    let markup = draftToHtml(rawContentState);
    return { __html: markup };
  }

  handleChange(inView: boolean, entry: IntersectionObserverEntry) {
    this.props.changeStep(this.props.index, 0, inView);
  }

  scrollIntoView() {
    let animationOptions = {
      // add offset so scrolled to line isnt exactly at top
      verticalOffset: -65,
    };

    animateScrollTo(this.myRef.current!, animationOptions);
  }

  calculateThreshold() {
    let { stepHeight } = this.state;
    let { height } = this.props;
    let intersectionHeight = height * 0.02;
    // handle case where a step is larger than viewport
    // if (stepHeight / intersectionHeight >= 1) {
    //   console.log("step is larger");
    //   return intersectionHeight / stepHeight;
    // }
    // return 1;

    // 1 percent
    if (stepHeight === 0) {
      return 0;
    }
    return 1.0 / stepHeight;
  }

  calculateRootMargin() {
    // let { pageYOffset, height } = this.props;
    // if (pageYOffset < height / 2) {
    //   return "0% 0% 0% 0%";
    // }
    return "-49% 0% -49% 0%";
  }

  render() {
    let { selected, index, intersectionRef } = this.props;

    let stepStyle = selected ? "Step--Selected" : "Step";

    return (
      <div ref={this.myRef}>
        {/* <InView
          threshold={this.calculateThreshold()}
          rootMargin={this.calculateRootMargin()}
          onChange={this.handleChange}
          // root={intersectionRef.current}
        >
          {({ inView, ref, entry }) => ( */}
        <div onClick={this.scrollIntoView} className={stepStyle}>
          <div>
            <div
              className={"InnerHTML"}
              dangerouslySetInnerHTML={this.renderDraftJS()}
            />
          </div>
          <div className={"divider"}></div>
        </div>
        {/* )} */}
        {/* </InView> */}
      </div>
    );
  }
}

export default PublishedStep;
