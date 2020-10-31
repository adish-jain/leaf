import React, { Component } from "react";
import "../styles/publishedstep.scss";
const draftToHtml = require("draftjs-to-html");
import animateScrollTo from "animated-scroll-to";

type PublishedStepProps = {
  index: number;
  text: string;
  selected: boolean;
  height: number;
};

type PublishedStepState = {};

class PublishedStep extends Component<PublishedStepProps, PublishedStepState> {
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: PublishedStepProps) {
    super(props);
    this.scrollIntoView = this.scrollIntoView.bind(this);

    this.myRef = React.createRef();

    this.state = {};
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
      verticalOffset: (-1 * height) / 2 + 64,
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
        </div>
      </div>
    );
  }
}

export default PublishedStep;
