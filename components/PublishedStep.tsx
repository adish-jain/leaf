import React, { Component, useEffect } from "react";
import "../styles/publishedstep.scss";
import { useInView, InView } from "react-intersection-observer";
const draftToHtml = require("draftjs-to-html");
import animateScrollTo from "animated-scroll-to";

type PublishedStepProps = {
  index: number;
  changeStep: (newStep: number, yPos: number, entered: boolean) => void;
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
    this.handleChange = this.handleChange.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
    this.calculateThreshold = this.calculateThreshold.bind(this);
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

    // handle case where a step is larger than viewport
    if (stepHeight / height >= 1) {
      return height / stepHeight;
    }
    return 1;
  }

  render() {
    let { selected, index } = this.props;

    let stepStyle = selected ? "Step--Selected" : "Step";

    return (
      <div ref={this.myRef} onClick={this.scrollIntoView}>
        <InView
          threshold={this.calculateThreshold()}
          rootMargin={"0% 0% 0% 0%"}
          onChange={this.handleChange}
        >
          {({ inView, ref, entry }) => (
            <div ref={ref} className={stepStyle}>
              <div
                className={"InnerHTML"}
                dangerouslySetInnerHTML={this.renderDraftJS()}
              />
            </div>
          )}
        </InView>
      </div>
    );
  }
}

export default PublishedStep;
