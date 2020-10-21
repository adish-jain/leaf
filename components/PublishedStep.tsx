import React, { Component, useEffect } from "react";
import "../styles/publishedstep.scss";
import { useInView, InView } from "react-intersection-observer";
const draftToHtml = require("draftjs-to-html");
import animateScrollTo from "animated-scroll-to";
import { motion, AnimatePresence } from "framer-motion";

type PublishedStepProps = {
  index: number;
  // changeStep: (newStep: number, yPos: number, entered: boolean) => void;
  text: string;
  selected: boolean;
  height: number;
};

type PublishedStepState = {
  stepHeight: number;
};

class PublishedStep extends Component<PublishedStepProps, PublishedStepState> {
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: PublishedStepProps) {
    super(props);
    this.scrollIntoView = this.scrollIntoView.bind(this);

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

  scrollIntoView() {
    let { height } = this.props;
    let animationOptions = {
      // add offset so scrolled to line isnt exactly at top
      verticalOffset: (-1 * height) / 2,
    };

    animateScrollTo(this.myRef.current!, animationOptions);
  }

  render() {
    let { selected, index } = this.props;

    let stepStyle = selected ? "Step--Selected" : "Step";

    return (
      <div ref={this.myRef}>
        <div onClick={this.scrollIntoView} className={stepStyle}>
          <div>
            <div
              className={"InnerHTML"}
              dangerouslySetInnerHTML={this.renderDraftJS()}
            />
          </div>
          {/* <div className={"divider"}></div> */}
        </div>
      </div>
    );
  }
}

export default PublishedStep;
